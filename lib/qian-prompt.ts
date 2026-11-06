import details from "@/lib/data/qian-detail.json";
import { boundaryRules, parseQuestion, questionTag } from "@/lib/prompt";
import { QIAN_COUNT, qianInfo, qianLabel } from "@/lib/qian";

const MAX_TRIES = 50;

const SYSTEM_PROMPT = `你是一位熟悉观音灵签的解签助手，依据系统提供的签文资料，为用户的问题解签。

【资料说明】
- 文末的「签文资料」由系统根据用户求得的签自动整理，采用艋舺龙山寺版观音一百签，用户已掷筊得圣杯确认。签已求定，不要重新求签或换签。
- 签诗、诗意、解曰是解签的核心依据；「圣意」是签版按事项列出的断语，请选取与用户问题最相关的一两项重点说明，不必全部罗列；圣意括号内为签版所附补注或异说。
- 「典故」只给出故事名，可简要说明故事与签意的关联，不确定的情节不要编造。
- 「等第」是签版所标的吉凶等级；若注有另作，说明各地传本等第不一。

【输出要求】
- 使用简体中文。引用签诗、解曰时可保留繁体原文，再用白话解释。
- 篇幅约 600 到 900 字，可使用 Markdown 标题、列表和加粗，不要使用表格。
- 依次包括：一句话结论，并点明等第；签诗的整体意思与关键句；结合用户问题的具体分析，引用相关圣意；切实可行的建议；最后用一句话提示解签结果仅供参考。
- 语气平和，不渲染恐惧，不使用“必定”“一定会”等绝对化断语。下签不等于厄运，应解读为提醒与警示；圣意中“凶”“有灾”之类的字眼要转述为需要留意的方面，不要照搬渲染。
- 这是一次性的解签页面，用户无法回复，不要向用户提问或等待回答。

${boundaryRules("解签")}`;

// 参数来自客户端，签文一律在服务端按签号重新查取
export function buildQianMessages(
  prompt: unknown,
  no: unknown,
  tries: unknown,
) {
  const question = parseQuestion(prompt);
  if (
    typeof no !== "number" ||
    !Number.isInteger(no) ||
    no < 1 ||
    no > QIAN_COUNT ||
    typeof tries !== "number" ||
    !Number.isInteger(tries) ||
    tries < 1 ||
    tries > MAX_TRIES
  ) {
    throw new Error("无效的签号");
  }
  const info = qianInfo(no);
  const detail = details[no - 1];
  const shengyi = Object.entries(detail.shengyi)
    .map(([key, value]) => `${key}：${value}`)
    .join("；");

  const grade = detail.gradeAlt
    ? `${info.grade}（另作${detail.gradeAlt}）`
    : info.grade;
  const system = `${SYSTEM_PROMPT}

【签文资料】
签号：${qianLabel(no)}，${grade}，${detail.palace}
典故：${info.title}
签诗：${info.poem.join("，")}
诗意：${detail.meaning}
解曰：${detail.jie}
圣意：${shengyi || "签版未列"}`;

  const meta = {
    question,
    gua: `${qianLabel(no)} ${info.title}`,
    changes: grade,
    zhi: `第 ${tries} 次掷得圣杯`,
  };
  return { system, user: questionTag(question), meta };
}
