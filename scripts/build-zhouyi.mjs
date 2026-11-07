// 从 lib/data/zhouyi/*.md 提取卦辞、爻辞与传统解卦，生成 lib/data/zhouyi.json
// 用法：node scripts/build-zhouyi.mjs
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = "lib/data/zhouyi";
const OUT = "lib/data/zhouyi.json";
const LINE_NAMES = [
  ...["初九", "九二", "九三", "九四", "九五", "上九"],
  ...["初六", "六二", "六三", "六四", "六五", "上六"],
];

function between(detail, title, end, mark) {
  const start = detail.indexOf(title);
  const stop = start === -1 ? -1 : detail.indexOf(end, start);
  if (stop === -1) {
    throw new Error(`${mark}：缺少「${title}」或其后的「${end}」`);
  }
  return detail
    .slice(start + title.length, stop)
    .replaceAll("**", "")
    .trim();
}

// 卦辞与大象：标题之后、第一个「白話文解釋」之前
function guaText(detail, mark) {
  const text = detail.match(/^# .*\n([\s\S]*?)\*\*白話文解釋\*\*/m)?.[1];
  if (!text) {
    throw new Error(`${mark}：缺少卦辞`);
  }
  return text.replaceAll("**", "").trim();
}

// 爻辞与小象，附白话解释
function yaoText(detail, name, mark) {
  const title = `**${name}爻辭**`;
  const text = between(detail, title, "**白話文解釋**", mark);
  const rest = detail.slice(detail.indexOf(title));
  const plain = between(
    rest,
    "**白話文解釋**",
    "**邵雍河洛理數爻辭解釋**",
    mark,
  );
  return plain ? `${text}\n白话：${plain}` : text;
}

const files = (await readdir(DIR)).filter((f) => f.endsWith(".md")).sort();
if (files.length !== 64) {
  throw new Error(`应有 64 卦，实际 ${files.length} 个文件`);
}

const result = {};
for (const file of files) {
  const mark = file.slice(0, -3);
  const detail = await readFile(path.join(DIR, file), "utf8");
  const yao = {};
  for (const name of LINE_NAMES) {
    if (detail.includes(`**${name}爻辭**`)) {
      yao[name] = yaoText(detail, name, mark);
    }
  }
  if (Object.keys(yao).length !== 6) {
    throw new Error(`${mark}：应有 6 条爻辞，实际 ${Object.keys(yao).length}`);
  }
  result[mark] = {
    gua: guaText(detail, mark),
    yao,
    // 传统解卦：卦象总述及大象、运势、事业、经商、求名、婚恋、决策
    tradition: between(detail, "**傳統解卦**", "**台灣張銘仁解卦**", mark),
  };
}

await writeFile(OUT, JSON.stringify(result, null, 2) + "\n");
console.log(`已生成 ${OUT}，共 ${files.length} 卦`);
