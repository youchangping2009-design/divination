import type { Metadata } from "next";
import Header from "@/components/header";
import Tarot from "@/components/tarot";

export const metadata: Metadata = {
  title: "AI 塔罗 - 在线塔罗占卜 GPT6 解牌",
  description:
    "AI 塔罗 - 随机洗牌抽取三张韦特塔罗牌，依据 Waite《塔罗图解》原文牌义，使用 AI 结合问题解牌｜塔罗占卜、在线塔罗、三张牌阵",
};

export default function TarotPage() {
  return (
    <>
      <Header />
      <Tarot />
    </>
  );
}
