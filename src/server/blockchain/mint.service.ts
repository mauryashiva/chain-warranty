import { getContract } from "./contract";

export const blockchainService = {
  // 🔥 MINT NFT
  async mintWarranty(walletAddress: string) {
    const contract = getContract();

    const tx = await contract.mint(walletAddress);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error("Transaction failed: No receipt found");
    }

    let tokenId: string | null = null;

    // 🔥 Extract tokenId from Transfer event
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
      } catch {
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

  // 🔥 TRANSFER NFT (NEW)
  async transferWarranty(
    fromWallet: string,
    toWallet: string,
    tokenId: string,
  ) {
    const contract = getContract();

    const tx = await contract.transferWarranty(fromWallet, toWallet, tokenId);

    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error("Transfer failed: No receipt found");
    }

    return {
      txHash: receipt.hash,
    };
  },
};
