"use client";
import React, { useEffect, useRef, useState } from "react";
import Question from "@/components/question";
import ResultAI from "@/components/result-ai";
import { DreamIntro } from "@/components/intro";
import { animateChildren } from "@/lib/animate";
import { DREAM_MAX_LENGTH, DreamMatch, matchDream } from "@/lib/dream";
import dreamPresets from "@/lib/data/dream-presets.json";
import { getDreamAnswer } from "@/app/server";
import { useAnswer } from "@/lib/use-answer";
import { Button } from "./ui/button";
import { BrainCircuit, ListRestart, MoonStar } from "lucide-react";

function Dream() {
  const [dream, setDream] = useState("");
  const {
    completion,
    isLoading,
    error,
    run: onCompletion,
  } = useAnswer(() => getDreamAnswer(dream));
  const [matches, setMatches] = useState<DreamMatch[]>([]);
  const [resultAi, setResultAi] = useState(false);

  const flexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flexRef.current) {
      return;
    }
    const observer = animateChildren(flexRef.current);
    return () => observer.disconnect();
  }, []);

  function start(value: string) {
    setDream(value);
    setMatches(matchDream(value));
  }

  function restartClick() {
    setDream("");
    setMatches([]);
    setResultAi(false);
  }

  function aiClick() {
    setResultAi(true);
    onCompletion();
  }

  return (
    <main
      ref={flexRef}
      className="gap mx-auto flex h-0 w-[90%] flex-1 flex-col flex-nowrap items-center overflow-y-auto"
    >
      {!dream && <DreamIntro />}

      <Question
        question={dream}
        setQuestion={start}
        icon={<MoonStar size={22} className="mr-2 shrink-0 text-indigo-500" />}
        label="您梦见了什么？"
        placeholder="梦里发生了什么？例：梦见掉牙，醒来很慌"
        startLabel="开始解梦"
        maxLength={DREAM_MAX_LENGTH}
        presets={dreamPresets}
      />

      {dream && (
        <div className="flex w-full max-w-md flex-col gap-3 rounded-md border border-indigo-200 bg-indigo-50/50 p-4 shadow dark:border-0 dark:bg-secondary dark:shadow-none">
          <span className="font-medium text-indigo-800 dark:text-indigo-400">
            古籍梦象 · 《新集周公解梦书》
          </span>
          {matches.length ? (
            <>
              {matches.map((match) => (
                <div key={match.name} className="flex gap-3">
                  <span className="h-fit shrink-0 rounded bg-indigo-700 px-2 py-0.5 text-sm text-white">
                    {match.name}
                  </span>
                  <div className="flex flex-col gap-0.5 text-sm">
                    {match.entries.map((entry) => (
                      <span key={entry}>{entry}</span>
                    ))}
                  </div>
                </div>
              ))}
              <span className="text-xs text-muted-foreground">
                古人断语多取象征，常有反解，不作字面预兆；AI
                会挑选与你的梦最贴近的条目解读。
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              古籍未收录与这个梦对应的梦象，AI 将主要从心理学角度解读。
            </span>
          )}
        </div>
      )}

      {dream && (
        <div className="flex gap-2">
          <Button size="sm" onClick={restartClick}>
            <ListRestart size={18} className="mr-1" />
            重来
          </Button>
          {resultAi ? null : (
            <Button
              size="sm"
              onClick={aiClick}
              className="bg-indigo-700 text-white hover:bg-indigo-800"
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
          action="解梦"
        />
      )}
    </main>
  );
}

export default Dream;
