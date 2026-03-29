// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WarrantyNFT is ERC721 {
    uint256 public tokenCounter;

    constructor() ERC721("WarrantyNFT", "WNFT") {}

    function mint(address to) public returns (uint256) {
        uint256 tokenId = tokenCounter;

        _safeMint(to, tokenId);

        tokenCounter++;
        return tokenId;
    }
}