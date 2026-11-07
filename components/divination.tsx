"use client";
import React, { useEffect, useRef, useState } from "react";
import Coin from "@/components/coin";
import Hexagram, { HexagramObj } from "@/components/hexagram";
import Result, { ResultObj } from "@/components/result";
import Question from "@/components/question";
import ResultAI from "@/components/result-ai";
import { animateChildren } from "@/lib/animate";
import { getGua, lineName, toYao } from "@/lib/gua";
import { playTossSound, unlockSound } from "@/lib/sound";
import TurtleIcon from "@/components/turtle-icon";
import { ZhouyiIntro } from "@/components/intro";
import zhouyiPresets from "@/lib/data/zhouyi-presets.json";
import { getAnswer } from "@/app/server";
import { useAnswer } from "@/lib/use-answer";
import { randomInt } from "@/lib/random";
import { Button } from "./ui/button";
import { BrainCircuit, ListRestart } from "lucide-react";

const AUTO_DELAY = 600;

function coinFront() {
  return randomInt(2) === 1;
}

function Divination() {
  const [frontList, setFrontList] = useState([true, true, true]);
  const [rotation, setRotation] = useState(false);

  const [hexagramList, setHexagramList] = useState<HexagramObj[]>([]);

  const [resultObj, setResultObj] = useState<ResultObj | null>(null);
  const [question, setQuestion] = useState("");
  const {
    completion,
    isLoading,
    error,
    run: onCompletion,
  } = useAnswer(() =>
    getAnswer(
      question,
      hexagramList.map((value) => toYao(value.yang, !!value.change)),
    ),
  );

  const [resultAi, setResultAi] = useState(false);

  const flexRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  // 自动卜筮
  useEffect(() => {
    if (rotation || resultObj || count >= 6 || !question) {
      return;
    }
    setTimeout(startClick, AUTO_DELAY);
  }, [question, rotation]);

  useEffect(() => {
    if (!flexRef.current) {
      return;
    }
    const observer = animateChildren(flexRef.current);
    return () => observer.disconnect();
  }, []);

  function onTransitionEnd() {
    setRotation(false);
    let frontCount = frontList.reduce((acc, val) => (val ? acc + 1 : acc), 0);
    setHexagramList((list) => {
      const newList = [
        ...list,
        {
          change: frontCount == 0 || frontCount == 3 || null,
          yang: frontCount >= 2,
          separate: list.length == 3,
        },
      ];
      setResult(newList);
      return newList;
    });
  }

  function startClick() {
    if (rotation) {
      return;
    }
    if (hexagramList.length >= 6) {
      setHexagramList([]);
    }
    setFrontList([coinFront(), coinFront(), coinFront()]);
    setRotation(true);
    playTossSound();
    setCount(count + 1);
  }

  function restartClick() {
    setResultObj(null);
    setHexagramList([]);
    setQuestion("");
    setResultAi(false);
    setCount(0);
  }

  function aiClick() {
    setResultAi(true);
    onCompletion();
  }

  function setResult(list: HexagramObj[]) {
    if (list.length != 6) {
      return;
    }
    const changeList: string[] = [];
    list.forEach((value, index) => {
      if (!value.change) {
        return;
      }
      changeList.push(lineName(index, value.yang));
    });

    setResultObj({
      ...getGua(list.map((value) => value.yang)),
      guaChange:
        changeList.length === 0 ? "无变爻" : `变爻: ${changeList.toString()}`,
    });
  }

  const showResult = resultObj !== null;
  const inputQuestion = question === "";
  return (
    <main
      ref={flexRef}
      className="gap mx-auto flex h-0 w-[90%] flex-1 flex-col flex-nowrap items-center overflow-y-auto"
    >
      {inputQuestion && <ZhouyiIntro />}

      <Question
        question={question}
        setQuestion={(value: string) => {
          unlockSound();
          setQuestion(value);
        }}
        label="您想决断什么？"
        placeholder="想决断哪件事？例：这个合作该不该接？"
        startLabel="开始起卦"
        presets={zhouyiPresets}
      />

      {!resultAi && !inputQuestion && (
        <Coin
          onTransitionEnd={onTransitionEnd}
          frontList={frontList}
          rotation={rotation}
        />
      )}

      {!inputQuestion && !showResult && (
        <div className="relative">
          <span className="flex items-center pl-2 text-lg font-medium">
            <TurtleIcon
              size={22}
              className="mr-1.5 text-amber-700 dark:text-amber-500"
            />
            第&nbsp;
            <span className="font-mono text-xl font-bold text-orange-500">
              {count === 0 ? "-/-" : `${count}/6`}
            </span>
            &nbsp;次卜筮
          </span>
        </div>
      )}

      {!inputQuestion && hexagramList.length != 0 && (
        <div className="flex max-w-md gap-2">
          <Hexagram list={hexagramList} />
          {showResult && (
            <div className="flex flex-col justify-around">
              <Result {...resultObj} />
              <div className="flex flex-col gap-2 sm:px-6">
                <Button size="sm" onClick={restartClick} disabled={rotation}>
                  <ListRestart size={18} className="mr-1" />
                  重来
                </Button>
                {resultAi ? null : (
                  <Button
                    size="sm"
                    onClick={aiClick}
                    disabled={rotation}
                    className="bg-amber-700 text-white hover:bg-amber-800"
                  >
                    <BrainCircuit size={16} className="mr-1" />
                    AI 解读
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {resultAi && (
        <ResultAI
          completion={completion}
          isLoading={isLoading}
          onCompletion={onCompletion}
          error={error}
        />
      )}
    </main>
  );
}

export default Divination;
