"use client"; // Ensure this is a client component
import "./globals.scss";
import { Metadata } from "next";
import localFont from "next/font/local";
import { EB_Garamond } from "next/font/google";
import { useEffect, useState } from "react";
import BackToTopCom from "./components/common/back-to-top-com";
import { Providers } from "@/redux/provider";
import ErrorBoundary from "./components/ErrorBoundary";
import { metadata } from "./metadata"; // Import the metadata from the new file

const gordita = localFont({
  src: [
    {
      path: "../../public/assets/fonts/gordita/gordita_medium-webfont.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gordita/gordita_medium-webfont.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gordita/gordita_regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gordita/gordita_regular-webfont.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--gorditas-font",
});

const garamond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--eb_garamond-font",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      setIsScrollable(
        document.documentElement.scrollHeight > window.innerHeight
      );
    };

    checkScrollable();

    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${gordita.variable} ${garamond.variable}`}
      >
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
        {isScrollable && <BackToTopCom />}
      </body>
    </html>
  );
}
