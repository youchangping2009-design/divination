import meanings from "@/lib/data/tarot-meanings.json";
import { boundaryRules, parseQuestion, questionTag } from "@/lib/prompt";
import { cardInfo, POSITIONS, TAROT_COUNT, TarotCard } from "@/lib/tarot";

const SYSTEM_PROMPT = `你是一位熟悉韦特塔罗（Rider–Waite Tarot）的解牌助手，依据系统提供的牌阵资料，为用户的问题解牌。

【资料说明】
- 文末的「牌阵资料」由系统根据用户随机抽出的牌自动整理，采用三张牌阵，三个位置依次代表过去、现在、未来。牌已经抽定，不要重新抽牌，也不要增减或替换牌。牌是随机抽出的，不要说“你选择的牌”。
- 每张牌的「牌义」引自 A. E. Waite《The Pictorial Key to the Tarot》（1910）英文原文，已按抽到的正位或逆位给出，是解读的核心依据；「牌面」是该书对画面的描述，用于理解象征。
- 逆位牌另附「正位牌义（对照）」，因为原文的逆位含义常以正位为参照，例如 “The same in a lesser sense”。解读逆位时以逆位牌义为准，正位牌义只用于理解这类参照。
- 原文牌义多为关键词罗列，常并列几种不同甚至相反的含义，请结合牌的位置和用户问题选取最贴切的含义，不必逐一罗列。
- 原文部分说法带有时代色彩，例如以发色、肤色判断人物，或关于婚姻、性别的旧观念，解读时不要照搬。

【输出要求】
- 使用简体中文。引用英文原文时附上中文翻译。
- 篇幅约 600 到 900 字，可使用 Markdown 标题、列表和加粗，不要使用表格。
- 依次包括：一句话结论；逐张牌解读，说明所在位置、正逆位与依据的牌义；三张牌之间的联系，以及结合用户问题的综合分析；切实可行的建议；最后用一句话提示解牌结果仅供参考。
- 语气平和，不渲染恐惧，不使用“必定”“一定会”等绝对化断语。逆位不等于凶兆，可理解为受阻、延迟或需要向内反思；死神、高塔等牌按象征意义解读，不作字面上的灾祸预言。
- 这是一次性的解牌页面，用户无法回复，不要向用户提问或等待回答。

${boundaryRules("解牌")}`;

function cardLabel(card: TarotCard) {
  const info = cardInfo(card.id);
  return `${info.zh}（${info.name}）${card.reversed ? "逆位" : "正位"}`;
}

// 参数来自客户端，牌名与牌义一律在服务端按编号重新查取
export function buildTarotMessages(prompt: unknown, cards: unknown) {
  const question = parseQuestion(prompt);
  if (
    !Array.isArray(cards) ||
    cards.length !== POSITIONS.length ||
    !cards.every(
      (card) =>
        Number.isInteger(card?.id) &&
        card.id >= 0 &&
        card.id < TAROT_COUNT &&
        typeof card.reversed === "boolean",
    ) ||
    new Set(cards.map((card) => card.id)).size !== cards.length
  ) {
    throw new Error("无效的牌阵");
  }
  const list = (cards as TarotCard[]).map(({ id, reversed }) => ({
    id,
    reversed,
  }));

  const sections = list.map((card, i) => {
    const meaning = meanings[card.id];
    const lines = card.reversed
      ? [
          `牌义（逆位）：${meaning.reversed}`,
          `正位牌义（对照）：${meaning.upright}`,
        ]
      : [`牌义（正位）：${meaning.upright}`];
    return [
      `【${POSITIONS[i]}：${cardLabel(card)}】`,
      ...lines,
      `牌面：${meaning.description}`,
    ].join("\n");
  });

  const [past, present, future] = list.map(cardLabel);
  const meta = { question, gua: past, changes: present, zhi: future };
  const system = `${SYSTEM_PROMPT}

【牌阵资料】
牌阵：三张牌阵（${POSITIONS.join("、")}）

${sections.join("\n\n")}`;
  return { system, user: questionTag(question), meta };
}
