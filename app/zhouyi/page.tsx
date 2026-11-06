import type { Metadata } from "next";
import Header from "@/components/header";
import Divination from "@/components/divination";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "AI 占卜 - 周易算卦，GPT-6 解卦",
  description:
    "AI 算卦 - 通过进行六次硬币的随机卜筮，生成卦象，并使用 AI 对卦象进行分析｜AI 算命、在线算命、在线算卦、周易易经64卦",
};

export default function ZhouyiPage() {
  return (
    <>
      <Header />
      <Divination />
      <Footer />
    </>
  );
}
