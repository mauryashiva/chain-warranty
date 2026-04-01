import ConnectWallet from "@/components/wallet/ConnectWallet";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 dark:bg-black">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border w-87.5">
        <h1 className="text-xl font-bold mb-4 text-center">Connect Wallet</h1>

        <ConnectWallet />
      </div>
    </div>
  );
}
