"use client";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Question from "@/components/question";
import ResultAI from "@/components/result-ai";
import { QianIntro } from "@/components/intro";
import { JiaoPair, QianStick, QianTube } from "@/components/qian-art";
import { animateChildren } from "@/lib/animate";
import { drawQian, Jiao, qianInfo, qianLabel, tossJiao } from "@/lib/qian";
import { qianSounds } from "@/lib/sound";
import qianPresets from "@/lib/data/qian-presets.json";
import { getQianAnswer } from "@/app/server";
import { readStreamableValue } from "ai/rsc";
import { Button } from "./ui/button";
import { BrainCircuit, ListRestart } from "lucide-react";
import { ERROR_PREFIX } from "@/lib/constant";

type Phase = "shake" | "drop" | "toss" | "landed" | "done";

const SHAKE_MS = 2000;
const RESHAKE_MS = 1500;
const DROP_MS = 900;
const TOSS_MS = 1100;
const LANDED_MS = { 圣杯: 800, 笑杯: 1400, 阴杯: 1400 };

const JIAO_TEXT: Record<Jiao, string> = {
  圣杯: "圣杯，签已确认",
  笑杯: "笑杯，重新求签",
  阴杯: "阴杯，重新求签",
};

const GRADE_COLOR: Record<string, string> = {
  上籤: "bg-red-700 text-white",
  中籤: "bg-amber-600 text-white",
  下籤: "bg-stone-500 text-white",
};

function Qian() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState<string>("");

  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase | null>(null);
  const [no, setNo] = useState(1);
  const [tries, setTries] = useState(1);
  const [jiao, setJiao] = useState<Jiao | null>(null);
  const [resultAi, setResultAi] = useState(false);

  const flexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flexRef.current) {
      return;
    }
    const observer = animateChildren(flexRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined;
    if (phase === "shake") {
      id = setTimeout(
        () => {
          setPhase("drop");
          qianSounds.drop.play();
        },
        tries === 1 ? SHAKE_MS : RESHAKE_MS,
      );
    } else if (phase === "drop") {
      id = setTimeout(() => {
        setJiao(tossJiao());
        setPhase("toss");
      }, DROP_MS);
    } else if (phase === "toss") {
      id = setTimeout(() => {
        qianSounds.jiao.play();
        setPhase("landed");
      }, TOSS_MS);
    } else if (phase === "landed" && jiao) {
      id = setTimeout(() => {
        if (jiao === "圣杯") {
          setPhase("done");
          return;
        }
        setTries((value) => value + 1);
        setNo(drawQian());
        setJiao(null);
        setPhase("shake");
        qianSounds.shake.play();
      }, LANDED_MS[jiao]);
    }
    return () => clearTimeout(id);
  }, [phase, jiao, tries]);

  async function onCompletion() {
    setError("");
    setCompletion("");
    setIsLoading(true);
    try {
      const { data, error } = await getQianAnswer(question, no, tries);
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        let ret = "";
        for await (const delta of readStreamableValue(data)) {
          if (delta.startsWith(ERROR_PREFIX)) {
            setError(delta.slice(ERROR_PREFIX.length));
            return;
          }
          ret += delta;
          setCompletion(ret);
        }
      }
    } catch (err: any) {
      setError(err.message ?? err);
    } finally {
      setIsLoading(false);
    }
  }

  function start(value: string) {
    // 摇签音效在点击中直接播放，落签和掷筊由定时器触发，需先解锁
    qianSounds.drop.unlock();
    qianSounds.jiao.unlock();
    qianSounds.shake.play();
    setQuestion(value);
    setTries(1);
    setNo(drawQian());
    setJiao(null);
    setPhase("shake");
  }

  function restartClick() {
    setQuestion("");
    setPhase(null);
    setJiao(null);
    setResultAi(false);
  }

  function aiClick() {
    setResultAi(true);
    onCompletion();
  }

  const info = qianInfo(no);
  const done = phase === "done";
  const showStick = phase === "drop" || phase === "toss" || phase === "landed";
  const showJiao = phase === "toss" || phase === "landed";

  return (
    <main
      ref={flexRef}
      className="gap mx-auto flex h-0 w-[90%] flex-1 flex-col flex-nowrap items-center overflow-y-auto"
    >
      {!question && <QianIntro />}

      <Question
        question={question}
        setQuestion={start}
        icon={<QianTube className="mr-2 h-6 w-5 shrink-0" />}
        label="您想求什么？"
        placeholder="请输入所求之事……"
        startLabel="开始求签"
        presets={qianPresets}
      />

      {phase && !done && (
        <div className="flex h-48 w-full max-w-md items-center justify-around rounded-md border bg-secondary px-4 shadow dark:border-0 dark:shadow-none">
          <QianTube
            className={clsx(
              "h-36 w-24 origin-bottom",
              phase === "shake" &&
                "animate-[qian-shake_0.25s_ease-in-out_infinite]",
            )}
          />
          {showStick && (
            <QianStick
              key={`${tries}-${no}`}
              label={qianLabel(no)}
              className="animate-[qian-drop_0.6s_ease-out]"
            />
          )}
          {showJiao && (
            <JiaoPair
              result={phase === "landed" ? jiao : null}
              tossing={phase === "toss"}
            />
          )}
        </div>
      )}

      {phase && !done && (
        <span className="text-lg font-medium">
          第&nbsp;
          <span className="font-mono text-xl font-bold text-red-700 dark:text-red-500">
            {tries}
          </span>
          &nbsp;次求签 · {phase === "shake" && "摇签中……"}
          {phase === "drop" && `落出${qianLabel(no)}`}
          {phase === "toss" && "掷筊确认中……"}
          {phase === "landed" && jiao && (
            <span
              className={clsx(
                jiao === "圣杯" && "text-red-700 dark:text-red-500",
              )}
            >
              {JIAO_TEXT[jiao]}
            </span>
          )}
        </span>
      )}

      {done && (
        <div className="flex w-full max-w-md flex-col gap-3 rounded-md border border-red-200 bg-[#fdf6e3] p-4 shadow dark:border-0 dark:bg-secondary dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-red-800 dark:text-red-400">
              观音灵签 · {qianLabel(no)}
            </span>
            <span
              className={clsx(
                "rounded px-2 py-0.5 text-sm",
                GRADE_COLOR[info.grade],
              )}
            >
              {info.grade}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            典故：{info.title} · 第 {tries} 次掷得圣杯
          </span>
          <div className="flex justify-center py-2">
            <div className="text-lg leading-loose tracking-[0.3em] [writing-mode:vertical-rl]">
              {info.poem.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {done && (
        <div className="flex gap-2">
          <Button size="sm" onClick={restartClick}>
            <ListRestart size={18} className="mr-1" />
            重来
          </Button>
          {resultAi ? null : (
            <Button
              size="sm"
              onClick={aiClick}
              className="bg-red-700 text-white hover:bg-red-800"
            >
              <BrainCircuit size={16} className="mr-1" />
              AI 解读
            </Button>
          )}
        </div>
      )}

      {resultAi && (
        <ResultAI
          completion={completion}
          isLoading={isLoading}
          onCompletion={onCompletion}
          error={error}
          action="解签"
        />
      )}
    </main>
  );
}

export default Qian;
