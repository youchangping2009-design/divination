import type { Metadata } from "next";
import Link from "next/link";
import { RETENTION_DAYS } from "@/lib/constant";

export const metadata: Metadata = {
  title: "隐私说明 - AI 占卜",
};

export default function Privacy() {
  return (
    <main className="h-0 flex-1 overflow-auto px-4 py-6">
      <article className="prose prose-sm mx-auto dark:prose-invert">
        <h1>隐私说明</h1>
        <p>为了改进占卜服务，本站会在你点击「AI 解读」后记录以下信息：</p>
        <ul>
          <li>
            你输入的问题或梦境描述，以及占卜结果（求得的签、抽到的牌、摇出的卦或匹配到的梦象）；
          </li>
          <li>根据网络地址推断的大致地区（国家、省份、城市）；</li>
          <li>设备类型与浏览器类型；</li>
          <li>
            由网络地址经不可逆加密生成的访客标识，用于区分不同访客。本站不保存你的完整
            IP 地址。
          </li>
        </ul>
        <p>
          如果你的问题涉及自伤、轻生等内容，本站不会保存问题原文，只记录一次危机提示。
        </p>
        <h2>用途与保存</h2>
        <ul>
          <li>
            以上信息仅用于统计分析和改进服务，不会出售，也不会提供给第三方。
          </li>
          <li>记录保存 {RETENTION_DAYS} 天，到期自动删除。</li>
          <li>
            本站部署在 Vercel，数据存储于 Neon
            数据库，服务器位于美国。使用本站即表示你同意上述信息在境外存储。
          </li>
          <li>问题内容会发送给 AI 模型服务商用于生成解读。</li>
        </ul>
        <p>
          如果不希望被记录，请不要提交涉及个人隐私或健康状况的问题，或停止使用本站。
        </p>
        <p>
          <Link href="/">返回首页</Link>
        </p>
      </article>
    </main>
  );
}
