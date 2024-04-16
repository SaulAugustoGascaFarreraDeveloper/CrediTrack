import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/providers/Provider";
import Navbar from "@/components/global/Navbar";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

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
            <body className={inter.className}>
              <Navbar />
              {children}
              <Toaster />
            </body>
          </html>
    </Provider>
   
  );
}
