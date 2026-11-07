import type { Metadata } from "next";
import { DivinationType, listLogs, LogRow } from "@/lib/log";
import { RETENTION_DAYS } from "@/lib/constant";

const RESULT_LABELS: Record<DivinationType, string[]> = {
  周易: ["本卦", "变爻", "之卦"],
  塔罗: ["过去", "现在", "未来"],
  求签: ["签号", "等第", "掷筊"],
  解梦: ["梦象", "条目"],
};

function ResultCell({ row }: { row: LogRow }) {
  const labels = RESULT_LABELS[row.type] ?? ["结果", "详情", "补充"];
  const values = [row.gua, row.changes, row.zhi];
  return (
    <div className="flex flex-col gap-0.5">
      {labels.map((label, i) => (
        <div key={label}>
          <span className="text-muted-foreground">{label}：</span>
          {values[i] ?? "—"}
        </div>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "占卜记录",
  robots: { index: false, follow: false },
};

const timeFormat = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const keyword = ((await searchParams).q ?? "").trim();
  const { rows, total, today, visitors } = await listLogs(keyword);

  return (
    <main className="h-0 flex-1 overflow-auto p-4 text-sm sm:p-6">
      <h1 className="text-lg font-medium">占卜记录</h1>
      <p className="mt-1 text-muted-foreground">
        共 {total} 条（保留 {RETENTION_DAYS} 天），今日 {today} 条，独立访客{" "}
        {visitors} 个
      </p>

      <form className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={keyword}
          placeholder="按问题、卦名、牌名、签号、梦象或城市搜索"
          className="w-64 rounded-md border bg-background px-3 py-1.5"
        />
        <button className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
          搜索
        </button>
      </form>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead className="text-muted-foreground">
            <tr className="border-b">
              <th className="p-2">时间</th>
              <th className="p-2">类型</th>
              <th className="p-2">问题</th>
              <th className="p-2">占卜结果</th>
              <th className="p-2">地区</th>
              <th className="p-2">设备</th>
              <th className="p-2">访客</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b align-top">
                <td className="whitespace-nowrap p-2">
                  {timeFormat.format(new Date(row.created_at))}
                </td>
                <td className="whitespace-nowrap p-2">{row.type}</td>
                <td className="max-w-xs p-2">
                  {row.crisis ? (
                    <span className="text-destructive">
                      （危机回复，未保存原文）
                    </span>
                  ) : (
                    (row.question ?? "—")
                  )}
                </td>
                <td className="p-2">
                  <ResultCell row={row} />
                </td>
                <td className="whitespace-nowrap p-2">
                  {[row.country, row.region, row.city]
                    .filter(Boolean)
                    .join(" ") || "—"}
                </td>
                <td className="whitespace-nowrap p-2">
                  {row.device} · {row.browser}
                </td>
                <td className="p-2 font-mono text-xs text-muted-foreground">
                  {row.ip_hash?.slice(0, 8) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-4 text-center text-muted-foreground">暂无记录</p>
        )}
      </div>
    </main>
  );
}
