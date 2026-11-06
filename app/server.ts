"use server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { ERROR_PREFIX } from "@/lib/constant";
import { Yao } from "@/lib/gua";
import { buildMessages } from "@/lib/prompt";
import { TarotCard } from "@/lib/tarot";
import { buildTarotMessages } from "@/lib/tarot-prompt";
import { DivinationType, getVisitor, saveLog } from "@/lib/log";
import { after } from "next/server";

const model = process.env.OPENAI_MODEL ?? "gpt-3.5-turbo";
const openai = createOpenAI({ baseURL: process.env.OPENAI_BASE_URL });

const STREAM_INTERVAL = 60;
const MAX_SIZE = 6;
// 推理模型的思考过程也计入该上限，过低会截断回答
const MAX_TOKENS = 4000;
// 系统提示要求危机回复给出这两条热线，以此识别危机回复
const CRISIS_HOTLINE = /12356|400-161-9995/;

type Messages = {
  system: string;
  user: string;
  meta: { question: string; gua: string; changes: string; zhi: string | null };
};

export async function getAnswer(prompt: string, yaoList: Yao[]) {
  return answer("周易", () => buildMessages(prompt, yaoList));
}

export async function getTarotAnswer(prompt: string, cards: TarotCard[]) {
  return answer("塔罗", async () => buildTarotMessages(prompt, cards));
}

async function answer(type: DivinationType, build: () => Promise<Messages>) {
  const stream = createStreamableValue();
  try {
    const { system, user, meta } = await build();
    const visitor = await getVisitor();

    const { fullStream } = streamText({
      temperature: 0.5,
      model: openai(model),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      maxTokens: MAX_TOKENS,
      maxRetries: 0,
    });

    let buffer = "";
    let done = false;
    const intervalId = setInterval(() => {
      if (done && buffer.length === 0) {
        clearInterval(intervalId);
        stream.done();
        return;
      }
      if (buffer.length <= MAX_SIZE) {
        stream.update(buffer);
        buffer = "";
      } else {
        const chunk = buffer.slice(0, MAX_SIZE);
        buffer = buffer.slice(MAX_SIZE);
        stream.update(chunk);
      }
    }, STREAM_INTERVAL);

    let answer = "";
    const generation = (async () => {
      for await (const part of fullStream) {
        switch (part.type) {
          case "text-delta":
            buffer += part.textDelta;
            answer += part.textDelta;
            break;
          case "error":
            const err = part.error as any;
            stream.update(ERROR_PREFIX + (err.message ?? err.toString()));
            break;
        }
      }
    })()
      .catch(console.error)
      .finally(() => {
        done = true;
      });

    after(async () => {
      await generation;
      await saveLog({
        ...meta,
        type,
        crisis: CRISIS_HOTLINE.test(answer),
        visitor,
      }).catch(console.error);
    });

    return { data: stream.value };
  } catch (err: any) {
    stream.done();
    return { error: err.message ?? err };
  }
}
