import { neon } from "@neondatabase/serverless";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { RETENTION_DAYS } from "@/lib/constant";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

let ready: Promise<unknown> | null = null;

function ensureTable() {
  ready ??= (async () => {
    await sql!`CREATE TABLE IF NOT EXISTS divination_logs (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      question TEXT,
      gua TEXT NOT NULL,
      changes TEXT NOT NULL,
      zhi TEXT,
      crisis BOOLEAN NOT NULL DEFAULT false,
      ip_hash TEXT,
      country TEXT,
      region TEXT,
      city TEXT,
      device TEXT,
      browser TEXT
    )`;
    await sql!`CREATE INDEX IF NOT EXISTS divination_logs_created_at ON divination_logs (created_at)`;
    await sql!`ALTER TABLE divination_logs ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT '周易'`;
  })().catch((err) => {
    ready = null;
    throw err;
  });
  return ready;
}

function browserName(ua: string) {
  if (/MicroMessenger/i.test(ua)) return "微信";
  if (/\bQQ\//i.test(ua)) return "QQ";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Chrome\/|CriOS/i.test(ua)) return "Chrome";
  if (/Firefox\/|FxiOS/i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua)) return "Safari";
  return "其他";
}

function decode(value: string | null) {
  try {
    return value ? decodeURIComponent(value) : null;
  } catch {
    return value;
  }
}

// 不保存原始 IP，只保存加盐哈希，用于区分同一访客
export async function getVisitor() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "";
  const salt = process.env.IP_HASH_SALT;
  const ua = h.get("user-agent") ?? "";
  return {
    ipHash:
      ip && salt
        ? createHash("sha256")
            .update(salt + ip)
            .digest("hex")
            .slice(0, 16)
        : null,
    country: h.get("x-vercel-ip-country"),
    region: decode(h.get("x-vercel-ip-country-region")),
    city: decode(h.get("x-vercel-ip-city")),
    device: /iPad|Tablet/i.test(ua)
      ? "平板"
      : /Mobile|Android|iPhone/i.test(ua)
        ? "手机"
        : "电脑",
    browser: browserName(ua),
  };
}

export type Visitor = Awaited<ReturnType<typeof getVisitor>>;

export type DivinationType = "周易" | "塔罗" | "求签" | "解梦";

// gua、changes、zhi 三列：周易依次存本卦、变爻、之卦，塔罗依次存过去、现在、未来三张牌，
// 求签依次存签号与典故、等第、掷筊结果，解梦存匹配到的梦象与条目数
export async function saveLog(record: {
  type: DivinationType;
  question: string;
  gua: string;
  changes: string;
  zhi: string | null;
  crisis: boolean;
  visitor: Visitor;
}) {
  if (!sql) {
    return;
  }
  await ensureTable();
  const { visitor: v } = record;
  // 触发危机回复的问题属于高度敏感信息，只记标记不存原文
  const question = record.crisis ? null : record.question;
  await sql`INSERT INTO divination_logs
    (type, question, gua, changes, zhi, crisis, ip_hash, country, region, city, device, browser)
    VALUES (${record.type}, ${question}, ${record.gua}, ${record.changes}, ${record.zhi},
      ${record.crisis}, ${v.ipHash}, ${v.country}, ${v.region}, ${v.city}, ${v.device}, ${v.browser})`;
  await sql`DELETE FROM divination_logs WHERE created_at < now() - make_interval(days => ${RETENTION_DAYS})`;
}

export type LogRow = {
  id: string;
  created_at: string;
  type: DivinationType;
  question: string | null;
  gua: string;
  changes: string;
  zhi: string | null;
  crisis: boolean;
  ip_hash: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
};

export async function listLogs(keyword: string, limit = 200) {
  if (!sql) {
    return { rows: [] as LogRow[], total: 0, today: 0, visitors: 0 };
  }
  await ensureTable();
  const pattern = `%${keyword}%`;
  const rows = (await sql`SELECT * FROM divination_logs
    WHERE ${keyword} = '' OR question ILIKE ${pattern} OR gua ILIKE ${pattern}
      OR changes ILIKE ${pattern} OR zhi ILIKE ${pattern} OR city ILIKE ${pattern}
    ORDER BY created_at DESC LIMIT ${limit}`) as LogRow[];
  const [stats] = await sql`SELECT
    count(*)::int AS total,
    count(*) FILTER (WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Shanghai') AT TIME ZONE 'Asia/Shanghai')::int AS today,
    count(DISTINCT ip_hash)::int AS visitors
    FROM divination_logs`;
  return {
    rows,
    total: stats.total as number,
    today: stats.today as number,
    visitors: stats.visitors as number,
  };
}
