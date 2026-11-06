import tarotList from "@/lib/data/tarot-list.json";
import { randomInt } from "@/lib/random";

export interface TarotCard {
  id: number;
  reversed: boolean;
}

export const TAROT_COUNT = tarotList.length;
export const POSITIONS = ["过去", "现在", "未来"];

export function cardInfo(id: number) {
  return tarotList[id];
}

export function cardImage(id: number) {
  return `/img/tarot/${id}.jpg`;
}

// Fisher–Yates 洗牌后取前三张，正逆位各自随机
export function drawCards(): TarotCard[] {
  const deck = Array.from({ length: TAROT_COUNT }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck
    .slice(0, POSITIONS.length)
    .map((id) => ({ id, reversed: randomInt(2) === 1 }));
}
