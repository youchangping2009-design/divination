// 返回 [0, n) 的均匀随机整数；拒绝采样，避免取模带来的偏差
export function randomInt(n: number) {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / n) * n;
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % n;
}
