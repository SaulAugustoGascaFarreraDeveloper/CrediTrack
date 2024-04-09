import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/providers/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Credi Track",
  description: "Developed by Saul Augusto Gasca Farrera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
           <html lang="en">
            <body className={inter.className}>{children}</body>
          </html>
    </Provider>
   
  );
}
