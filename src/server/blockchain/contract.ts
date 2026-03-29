import { ethers } from "ethers";
import { ABI } from "./abi";

export const getContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    ABI,
    wallet, // 🔥 MUST use wallet (signer)
  );
};
