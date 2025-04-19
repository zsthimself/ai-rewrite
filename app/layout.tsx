import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { MainLayout } from "@/components/layout/MainLayout";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Writer | Professional Writing Tools",
  description: "AI-powered tools to improve your writing - paraphraser, grammar checker, summarizer and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </ClerkProvider>
      </body>
    </html>
  );
}
