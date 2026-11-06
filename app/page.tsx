import type { Metadata } from "next";
import Header from "@/components/header";
import Qian from "@/components/qian";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "AI 占卜 - 观音灵签，GPT-6 解签",
  description:
    "AI 求签 - 摇签后掷筊确认，依艋舺龙山寺版观音一百签签文与签版圣意，使用 AI 结合问题解签｜观音灵签、在线求签、解签",
};

export default function Home() {
  return (
    <>
      <Header />
      <Qian />
      <Footer />
    </>
  );
}
