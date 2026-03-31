import "./globals.css";
import { Providers } from "./providers";
import { MobileLayout } from "@/components/layouts/MobileLayout";

export const metadata = {
  title: "ChainWarranty Mobile",
  description: "Secure NFT Warranties on the go",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MobileLayout>{children}</MobileLayout>
        </Providers>
      </body>
    </html>
  );
}
