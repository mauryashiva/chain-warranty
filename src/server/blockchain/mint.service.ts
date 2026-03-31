import { getContract } from "./contract";

export const blockchainService = {
  async mintWarranty(walletAddress: string) {
    const contract = getContract();

    // 1. Send the transaction
    const tx = await contract.mint(walletAddress);

    // 2. Wait for confirmation
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error("Transaction failed: No receipt found");
    }

    let tokenId: string | null = null;

    // 3. Robust Event Parsing
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });

        if (parsedLog && parsedLog.name === "Transfer") {
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!tokenId) {
      throw new Error("TokenId not found in event logs");
    }

    return {
      tokenId,
      txHash: receipt.hash,
    };
  },

  /**
   * 🔥 NEW: Transfer NFT from one wallet to another
   * @param fromAddress The current owner's wallet address
   * @param toAddress The new owner's wallet address
   * @param tokenId The ID of the warranty NFT
   */
  async transferWarranty(
    fromAddress: string,
    toAddress: string,
    tokenId: string,
  ) {
    const contract = getContract();

    try {
      // Calling the standard ERC721 transferFrom
      // Note: The backend PRIVATE_KEY wallet must have permission
      // or be the one initiating the transfer logic.
      const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);

      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transfer transaction failed: No receipt found");
      }

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("Blockchain Transfer Error:", error);
      throw new Error(`Failed to transfer NFT: ${error.message}`);
    }
  },
};
