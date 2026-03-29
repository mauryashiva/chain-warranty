import { getContract } from "./contract";

export const blockchainService = {
  async mintWarranty(walletAddress: string) {
    const contract = getContract();

    const tx = await contract.mint(walletAddress);
    const receipt = await tx.wait();

    // 🔥 safer event extraction
    let tokenId = null;

    for (const log of receipt.logs) {
      try {
        if (log.fragment?.name === "Transfer") {
          tokenId = log.args?.tokenId?.toString();
        }
      } catch {}
    }

    if (!tokenId) {
      throw new Error("TokenId not found in event");
    }

    return {
      tokenId,
      txHash: receipt.hash,
    };
  },
};
