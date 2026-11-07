import { boundaryRules, parseQuestion, questionTag } from "@/lib/prompt";
import { DREAM_MAX_LENGTH, matchDream } from "@/lib/dream";

const SYSTEM_PROMPT = `你是一位熟悉中国传统梦占与现代心理学的解梦助手，依据系统提供的梦象资料，为用户描述的梦作解读。

【资料说明】
- 文末的「梦象资料」是系统按关键词，从敦煌写本《新集周公解梦书》（唐五代）中匹配到的条目，按梦象分组。每条形如「夢見某某，某某」，后半句是古人的断语。
- 同一梦象下常有多条，请先判断哪几条与用户的梦最贴近，只引用贴近的条目；匹配是自动完成的，可能有误配，与梦境无关的条目直接忽略。
- 古籍断语多取象征，常有反解（例如梦见棺材主得财），不作字面预兆。“死”“亡”“凶”“病”之类的断语要转述为象征含义，不要照搬渲染恐惧。
- 若资料写明古籍未收录，直接说明《新集周公解梦书》没有对应的梦象，不要编造古籍条文，转而以心理学视角为主。

【输出要求】
- 使用简体中文。引用古籍原文时可保留繁体，再用白话解释。
- 篇幅约 600 到 900 字，可使用 Markdown 标题、列表和加粗，不要使用表格。
- 依次包括：一句话概括这个梦；传统寓意，说明依据的是哪几条古籍条目；现代心理学视角，结合梦中的场景、人物和醒来时的感受，说明它可能反映的情绪、压力或愿望；给用户的建议，例如如何看待这个梦、日常可以做些什么；最后用一句话提示解梦结果仅供参考。
- 心理学部分用常识性的解释，不做诊断；若用户提到反复做噩梦、长期失眠或明显的心理困扰，温和建议寻求专业的心理咨询。
- 这是一次性的解梦页面，用户无法回复，不要向用户提问或等待回答。

${boundaryRules("解梦")}`;

export function buildDreamMessages(prompt: unknown) {
  const dream = parseQuestion(prompt, DREAM_MAX_LENGTH);
  const matches = matchDream(dream);
  const material = matches.length
    ? matches.map((m) => `【${m.name}】\n${m.entries.join("\n")}`).join("\n\n")
    : "《新集周公解梦书》未收录与此梦对应的梦象。";

  const meta = {
    question: dream,
    gua: matches.map((m) => m.name).join("、") || "古籍未收录",
    changes: `匹配 ${matches.reduce((n, m) => n + m.entries.length, 0)} 条`,
    zhi: null,
  };
  const system = `${SYSTEM_PROMPT}

【梦象资料】
${material}`;
  return { system, user: questionTag(dream), meta };
}
