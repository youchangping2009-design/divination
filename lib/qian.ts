import qianList from "@/lib/data/qian-list.json";
import { randomInt } from "@/lib/random";

export const QIAN_COUNT = qianList.length;

export type Jiao = "圣杯" | "笑杯" | "阴杯";

const DIGITS = "〇一二三四五六七八九";

function chineseNumber(n: number) {
  if (n === 100) {
    return "一百";
  }
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    (tens > 1 ? DIGITS[tens] : "") +
    (tens > 0 ? "十" : "") +
    (ones > 0 ? DIGITS[ones] : "")
  );
}

export function qianInfo(no: number) {
  return qianList[no - 1];
}

// 签号 1–100，签文保留繁体，例：第十八籤
export function qianLabel(no: number) {
  return `第${chineseNumber(no)}籤`;
}

export function drawQian() {
  return randomInt(QIAN_COUNT) + 1;
}

// 一平一凸为圣杯（1/2），两平为笑杯、两凸为阴杯（各 1/4）
export function tossJiao(): Jiao {
  const r = randomInt(4);
  return r < 2 ? "圣杯" : r === 2 ? "笑杯" : "阴杯";
}
