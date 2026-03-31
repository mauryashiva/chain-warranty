// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WarrantyNFT is ERC721 {
    uint256 public tokenCounter;

    // 🔥 Custom event (optional but useful for backend tracking)
    event WarrantyMinted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("WarrantyNFT", "WNFT") {}

    function mint(address to) public returns (uint256) {
        uint256 tokenId = tokenCounter;

        _safeMint(to, tokenId);

        emit WarrantyMinted(to, tokenId); // 🔥 custom event

        tokenCounter++;
        return tokenId;
    }

    // 🔥 Transfer function (explicit for backend usage)
    function transferWarranty(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Not owner");

        safeTransferFrom(from, to, tokenId);
    }
}