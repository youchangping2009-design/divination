import entries from "@/lib/data/dream-entries.json";
import tags from "@/lib/data/dream-tags.json";

export const DREAM_MAX_LENGTH = 500;
const MAX_TAGS = 5;

// 日常用语里含梦象字的词，匹配前先去掉，避免「马上」匹配到马、「上海」匹配到海
const FALSE_FRIENDS = [
  "马上",
  "馬上",
  "马虎",
  "馬虎",
  "上海",
  "海南",
  "海外",
  "江苏",
  "江蘇",
  "江西",
  "浙江",
  "湖南",
  "湖北",
  "河南",
  "河北",
  "火车",
  "火車",
  "火锅",
  "火鍋",
  "发火",
  "發火",
  "火气",
  "火氣",
  "牛逼",
  "牛奶",
  "土豆",
  "起床",
  "床上",
  "花钱",
  "花錢",
  "花费",
  "花費",
  "龙虾",
  "龍蝦",
  "部门",
  "部門",
  "雪糕",
  "门票",
  "門票",
  "天天",
  "今天",
  "明天",
  "昨天",
  "每天",
  "白天",
  "当天",
  "當天",
  "一路",
  "路过",
  "路過",
];

export interface DreamMatch {
  name: string;
  entries: string[];
}

export function matchDream(text: string): DreamMatch[] {
  let content = text;
  for (const word of FALSE_FRIENDS) {
    content = content.replaceAll(word, "　");
  }
  return tags
    .map((tag) => ({
      tag,
      pos: Math.min(
        ...tag.words.map((word) => {
          const i = content.indexOf(word);
          return i < 0 ? Infinity : i;
        }),
      ),
    }))
    .filter((hit) => hit.pos !== Infinity)
    .sort((a, b) => a.pos - b.pos)
    .slice(0, MAX_TAGS)
    .map(({ tag }) => ({
      name: tag.name,
      entries: tag.entries.map((i) => entries[i].text),
    }));
}
