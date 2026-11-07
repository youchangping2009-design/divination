import type { Metadata } from "next";
import Header from "@/components/header";
import Dream from "@/components/dream";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "AI 占卜 - 周公解梦，GPT-6 解梦",
  description:
    "AI 解梦 - 依唐五代敦煌写本《新集周公解梦书》检索梦象，结合传统寓意与现代心理学，使用 AI 解读你的梦｜周公解梦、在线解梦、梦境解析",
};

export default function DreamPage() {
  return (
    <>
      <Header />
      <Dream />
      <Footer />
    </>
  );
}
