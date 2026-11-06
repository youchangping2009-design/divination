import "./globals.css";
import type { Metadata, Viewport } from "next";
import React from "react";
import Umami from "@/components/umami";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "AI 占卜 - 求签、周易、塔罗，GPT-6 解读",
  description:
    "AI 占卜 - 观音灵签求签、周易六爻起卦、韦特塔罗三张牌阵，使用 AI 结合问题解读｜在线求签、在线算卦、塔罗占卜",
  appleWebApp: {
    title: "AI 占卜",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#333333" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cn" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://registry.npmmirror.com/lxgw-wenkai-screen-web/latest/files/lxgwwenkaiscreen/result.css"
        />
      </head>
      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Umami />
      </body>
    </html>
  );
}
