import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skyline Smart Lighting | Free Quote for Permanent Christmas Lights",
  description:
    "Get a free quote for professionally installed permanent Christmas lights. In around 10 minutes, our team will call to discuss options and see if we're a good fit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="flex-1">{children}</div>
        <ConditionalFooter />
      </body>
    </html>
  );
}
