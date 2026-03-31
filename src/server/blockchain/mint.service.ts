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
    // We look specifically for the 'Transfer' event from our contract
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });

        if (parsedLog && parsedLog.name === "Transfer") {
          // In ERC721, Transfer args are (from, to, tokenId)
          // parsedLog.args[2] is the tokenId
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (e) {
        // Log doesn't belong to this contract/interface, skip it
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
};
