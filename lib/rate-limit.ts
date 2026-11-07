const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_KEYS = 10000;

// 计数只存在当前进程内存中：单实例部署（如 Docker）全局生效，多实例时各实例分别计数
const hits = new Map<string, number[]>();

// 返回 true 表示放行并记一次
export function rateLimit(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) {
    hits.delete(hits.keys().next().value!);
  }
  return true;
}

export const RATE_LIMIT_MESSAGE = `请求太频繁了，每小时最多 ${MAX_REQUESTS} 次 AI 解读，请稍后再试`;
