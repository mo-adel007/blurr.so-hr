import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { Loading } from "@/components/loading";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Next.js Auth App",
  description: "A Next.js application with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Navigation />
          <Suspense fallback={<Loading />}>
            <main className="min-h-screen pt-16">{children}</main>
          </Suspense>{" "}
        </Providers>
      </body>
    </html>
  );
}
