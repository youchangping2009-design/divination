"use client";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Question from "@/components/question";
import ResultAI from "@/components/result-ai";
import TarotCardView, { CARD_SIZE, CardBack } from "@/components/tarot-card";
import { TarotIntro } from "@/components/intro";
import { animateChildren } from "@/lib/animate";
import { tarotSounds } from "@/lib/sound";
import tarotPresets from "@/lib/data/tarot-presets.json";
import {
  cardImage,
  cardInfo,
  drawCards,
  POSITIONS,
  TarotCard,
} from "@/lib/tarot";
import { getTarotAnswer } from "@/app/server";
import { readStreamableValue } from "ai/rsc";
import { Button } from "./ui/button";
import { BrainCircuit, ListRestart, Sparkles } from "lucide-react";
import { ERROR_PREFIX } from "@/lib/constant";

// 第 0 步洗牌；之后每张牌先发牌（奇数步）再翻开（偶数步）
const STEP_DELAYS = [2400, 500, 800, 500, 800, 500, 800];
const DONE_STEP = STEP_DELAYS.length;
const DECK_SIZE = 6;

function Tarot() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState<string>("");

  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<TarotCard[] | null>(null);
  const [step, setStep] = useState(0);
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
    if (!cards || step >= DONE_STEP) {
      return;
    }
    const id = setTimeout(() => setStep(step + 1), STEP_DELAYS[step]);
    return () => clearTimeout(id);
  }, [cards, step]);

  useEffect(() => {
    if (!cards || step === 0 || step >= DONE_STEP) {
      return;
    }
    (step % 2 ? tarotSounds.deal : tarotSounds.flip).play();
  }, [cards, step]);

  async function onCompletion() {
    setError("");
    setCompletion("");
    setIsLoading(true);
    try {
      const { data, error } = await getTarotAnswer(question, cards!);
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
    // 洗牌音效在点击中直接播放，发牌和翻牌由定时器触发，需先解锁
    tarotSounds.deal.unlock();
    tarotSounds.flip.unlock();
    tarotSounds.shuffle.play();
    const drawn = drawCards();
    // 提前加载牌面，翻牌时不出现空白
    drawn.forEach((card) => {
      new window.Image().src = cardImage(card.id);
    });
    setQuestion(value);
    setCards(drawn);
    setStep(0);
  }

  function restartClick() {
    setQuestion("");
    setCards(null);
    setStep(0);
    setResultAi(false);
  }

  function aiClick() {
    setResultAi(true);
    onCompletion();
  }

  const dealt = Math.min(Math.floor((step + 1) / 2), POSITIONS.length);
  const revealed = Math.floor(step / 2);
  const done = step >= DONE_STEP;

  return (
    <main
      ref={flexRef}
      className="gap mx-auto flex h-0 w-[90%] flex-1 flex-col flex-nowrap items-center overflow-y-auto"
    >
      {!question && <TarotIntro />}

      <Question
        question={question}
        setQuestion={start}
        icon={<Sparkles size={22} className="mr-2 shrink-0 text-purple-500" />}
        label="您想问什么？"
        placeholder="请输入想问塔罗的事……"
        startLabel="开始抽牌"
        presets={tarotPresets}
      />

      {cards && (
        <div className="flex w-full max-w-md justify-around rounded-md border bg-secondary px-2 py-4 shadow dark:border-0 dark:shadow-none sm:p-6">
          {step === 0 ? (
            <div className={clsx(CARD_SIZE, "relative")}>
              {Array.from({ length: DECK_SIZE }, (_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "absolute inset-0",
                    i % 2
                      ? "animate-[tarot-shuffle-left_0.8s_ease-in-out_3]"
                      : "animate-[tarot-shuffle-right_0.8s_ease-in-out_3]",
                  )}
                  style={{ top: -i, left: i, animationDelay: `${i * 40}ms` }}
                >
                  <CardBack />
                </div>
              ))}
            </div>
          ) : (
            POSITIONS.map((position, i) => (
              <div key={position} className="flex flex-col items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {position}
                </span>
                {i < dealt ? (
                  <TarotCardView card={cards[i]} revealed={i < revealed} />
                ) : (
                  <div
                    className={clsx(
                      CARD_SIZE,
                      "rounded-md border-2 border-dashed border-border",
                    )}
                  />
                )}
                <CardName card={cards[i]} visible={i < revealed} />
              </div>
            ))
          )}
        </div>
      )}

      {cards && !done && (
        <span className="flex items-center pl-2 text-lg font-medium">
          <Sparkles size={20} className="mr-1.5 text-purple-500" />
          {step === 0 ? (
            "洗牌中……"
          ) : (
            <>
              第&nbsp;
              <span className="font-mono text-xl font-bold text-orange-500">
                {`${dealt}/${POSITIONS.length}`}
              </span>
              &nbsp;张牌
            </>
          )}
        </span>
      )}

      {done && (
        <div className="flex gap-2">
          <Button size="sm" onClick={restartClick}>
            <ListRestart size={18} className="mr-1" />
            重来
          </Button>
          {resultAi ? null : (
            <Button size="sm" onClick={aiClick}>
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
          action="解牌"
        />
      )}
    </main>
  );
}

function CardName(props: { card: TarotCard; visible: boolean }) {
  const info = cardInfo(props.card.id);
  return (
    <div
      className={clsx(
        "flex h-14 flex-col items-center text-center transition-opacity duration-500",
        props.visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="font-medium">{info.zh}</span>
      <span className="text-xs text-muted-foreground">{info.name}</span>
      <span
        className={clsx(
          "text-xs",
          props.card.reversed ? "text-red-400" : "text-muted-foreground",
        )}
      >
        {props.card.reversed ? "逆位" : "正位"}
      </span>
    </div>
  );
}

export default Tarot;
