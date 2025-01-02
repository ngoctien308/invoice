import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Container from "@/components/Container";
import Footer from "@/components/Footer";

const inter = Inter();

export const metadata: Metadata = {
  title: "Invoices"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased`}
        >
          <Container className="min-h-screen grid grid-rows-[auto_1fr_auto]">
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </Container>
        </body>
      </html>
    </ClerkProvider>
  );
}
