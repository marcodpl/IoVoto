const hre = require("hardhat");

async function main() {
  const AE_PRIVATE_KEY =
    process.env.AE_PRIVATE_KEY ||
    "0x1000000000000000000000000000000000000000000000000000000000000001";
  const AE_ADDRESS = new hre.ethers.Wallet(AE_PRIVATE_KEY).address;

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(AE_ADDRESS);

  await voting.deployed();

  console.log("Contract deployed to:", voting.address);
  console.log("AE address:", AE_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
