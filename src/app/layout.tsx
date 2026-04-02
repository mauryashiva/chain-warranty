import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

// Professional sans-serif font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChainWarranty | Enterprise Asset Protection",
  description: "Blockchain-verified warranty management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-white text-slate-950 antialiased dark:bg-black dark:text-white",
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
