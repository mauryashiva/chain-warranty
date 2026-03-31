import { ethers } from "ethers";
import { ABI } from "./abi";

export const getContract = () => {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!rpcUrl) {
    throw new Error("RPC_URL is missing in environment variables");
  }

  if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing in environment variables");
  }

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is missing in environment variables");
  }

  // 🔥 Provider (read from blockchain)
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // 🔥 Wallet (sign transactions)
  const wallet = new ethers.Wallet(privateKey, provider);

  // 🔥 Contract instance
  return new ethers.Contract(contractAddress, ABI, wallet);
};
