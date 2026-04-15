const { ethers } = require("hardhat");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  "function submitVote(bytes32 nullifier, bytes32 commitment, bytes signature)",
  "function getVote(bytes32 nullifier) view returns (bytes32)",
  "function aeAddress() view returns (address)"
];

async function main() {
  const res = await fetch("http://127.0.0.1:8000/generate_vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_secret: "user123",
      vote: "SI"
    })
  });

  const data = await res.json();
  console.log("Backend response:", data);

  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const contractAeAddress = await contract.aeAddress();

  if (contractAeAddress.toLowerCase() !== data.ae_address.toLowerCase()) {
    throw new Error(
      `AE address mismatch. Contract expects ${contractAeAddress}, backend signed as ${data.ae_address}.`
    );
  }

  const tx = await contract.submitVote(
    "0x" + data.nullifier,
    "0x" + data.commitment,
    "0x" + data.signature
  );

  await tx.wait();
  console.log("Vote submitted");

  const stored = await contract.getVote("0x" + data.nullifier);
  console.log("On-chain commitment:", stored);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
