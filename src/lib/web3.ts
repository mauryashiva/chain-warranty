import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!(window as any).ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider((window as any).ethereum);

  // Request account
  const accounts = await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();

  return {
    address: accounts[0],
    signer,
  };
};
