import React, { createRef, useState } from "react";
import clsx from "clsx";
import todayJson from "@/lib/data/today.json";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { QUESTION_MAX_LENGTH } from "@/lib/constant";

const todayData: string[] = todayJson;

function Question(props: { question: string; setQuestion: any }) {
  const inputRef = createRef<HTMLTextAreaElement>();
  const [empty, setEmpty] = useState(false);

  function startClick() {
    const value = inputRef.current?.value;
    if (!value?.trim()) {
      setEmpty(true);
      inputRef.current?.focus();
      return;
    }
    props.setQuestion(value);
  }

  function todayClick(index: number) {
    props.setQuestion(todayData[index]);
  }

  return (
    <div
      className={clsx(
        "ignore-animate flex w-full max-w-md flex-col gap-4",
        props.question || "pt-6",
      )}
    >
      {props.question === "" ? (
        <>
          <label>您想算点什么？</label>
          <Textarea
            ref={inputRef}
            placeholder="请输入心中所想……"
            className={clsx(
              "resize-none",
              empty && "border-destructive focus-visible:ring-destructive",
            )}
            rows={4}
            maxLength={QUESTION_MAX_LENGTH}
            onChange={() => empty && setEmpty(false)}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-destructive">
              {empty && "请先输入您想算的事情"}
            </span>
            <Button size="sm" onClick={startClick}>
              开始
            </Button>
          </div>
          <label className="mt-16 underline underline-offset-4">
            🧐 要不算算这些事？
          </label>
          <div className="flex flex-wrap gap-3">
            {todayData.map(function (value, index) {
              return (
                <span
                  key={index}
                  onClick={() => {
                    todayClick(index);
                  }}
                  className="rounded-md border bg-secondary p-2 text-sm text-muted-foreground shadow transition hover:scale-[1.03] dark:border-0 dark:text-foreground/80 dark:shadow-none"
                >
                  {value}
                </span>
              );
            })}
          </div>
        </>
      ) : null}

      {props.question && (
        <div className="flex truncate rounded-md border bg-secondary p-2 shadow dark:border-0 dark:shadow-none">
          <Image
            width={24}
            height={24}
            className="mr-2"
            src="/img/yin-yang.webp"
            alt="yinyang"
          />
          {props.question}
        </div>
      )}
    </div>
  );
}

export default Question;
