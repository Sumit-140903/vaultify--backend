// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vaultify {
    struct Document {
        address owner;
        string title;
        string ipfsCid;
        bytes32 hash;
    }

    mapping(uint => Document) public documents;
    uint public documentCount;

    event DocumentUploaded(uint indexed id, address indexed owner, string title, string ipfsCid, bytes32 hash);

    function uploadDocument(string memory title, string memory ipfsCid, bytes32 hash) public {
        documents[documentCount] = Document(msg.sender, title, ipfsCid, hash);
        emit DocumentUploaded(documentCount, msg.sender, title, ipfsCid, hash);
        documentCount++;
    }

    function getDocument(uint id) public view returns (address, string memory, string memory, bytes32) {
        Document memory doc = documents[id];
        return (doc.owner, doc.title, doc.ipfsCid, doc.hash);
    }
}
