import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Stock Brief",
    description: "Your daily stock briefing",
};

import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn("min-h-screen bg-gray-100 font-sans antialiased flex flex-col items-center justify-center", inter.variable)}>
                <div className="w-full max-w-[480px] min-h-screen bg-white shadow-2xl overflow-y-auto relative">
                    {children}
                    <Toaster />
                </div>
            </body>
        </html>
    );
}
