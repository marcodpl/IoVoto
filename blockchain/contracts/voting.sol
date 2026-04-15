// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {

    mapping(bytes32 => bytes32) public votes;

    address public aeAddress;

    event VoteSubmitted(bytes32 nullifier, bytes32 commitment);

    constructor(address _aeAddress) {
        aeAddress = _aeAddress;
    }

    function submitVote(
        bytes32 nullifier,
        bytes32 commitment,
        bytes memory signature
    ) public {

        // 1. crea hash del messaggio
        bytes32 messageHash = keccak256(abi.encodePacked(commitment));

        // 2. prefisso Ethereum
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                messageHash
            )
        );

        // 3. recupera signer
        address signer = recoverSigner(ethSignedMessageHash, signature);

        // 4. verifica AE
        require(signer == aeAddress, "Invalid signature");

        // 5. salva voto
        votes[nullifier] = commitment;

        emit VoteSubmitted(nullifier, commitment);
    }

    function recoverSigner(bytes32 hash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        require(sig.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return ecrecover(hash, v, r, s);
    }

    function getVote(bytes32 nullifier) public view returns (bytes32) {
        return votes[nullifier];
    }
}