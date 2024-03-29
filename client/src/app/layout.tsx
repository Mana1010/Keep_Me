import type { Metadata } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import Provider from "./Provider";
import { Toaster as ToasterUI } from "@/components/ui/toaster";
import React from "react";
const DMSans = DM_Sans({ subsets: ["latin"] });
const Montserrat_font = Montserrat({ subsets: ["latin"] });
const Poppins_font = Poppins({ subsets: ["latin"], weight: ["400"] });
export const metadata: Metadata = {
  title: "KeepMe",
  description: "Generated by create next app",
};
const Sidebar = React.lazy(() => import("./components/Sidebar"));
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className={`${Poppins_font.className} flex`}>
            <Sidebar />
            <Header />
            <NextTopLoader color="#120C18" shadow={false} />
            {children}
            <Toaster duration={800} theme="system" />
            <ToasterUI />
          </div>
        </Provider>
      </body>
    </html>
  );
}
