import React, { createRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { QUESTION_MAX_LENGTH } from "@/lib/constant";

export interface Presets {
  label: string;
  hint: string;
  groups: { name: string; items: string[] }[];
}

function Question(props: {
  question: string;
  setQuestion: any;
  presets: Presets;
  icon?: React.ReactNode;
  label?: string;
  placeholder?: string;
  startLabel?: string;
}) {
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

  // 只填入输入框，由用户补充具体情况后再开始
  function presetClick(item: string) {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.value = item;
    input.focus();
    input.setSelectionRange(item.length, item.length);
    setEmpty(false);
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
          <label>{props.label ?? "您想算点什么？"}</label>
          <Textarea
            ref={inputRef}
            placeholder={props.placeholder ?? "请输入心中所想……"}
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
              {props.startLabel ?? "开始"}
            </Button>
          </div>
          <div className="mt-12 flex flex-col gap-1">
            <label className="underline underline-offset-4">
              {props.presets.label}
            </label>
            <span className="text-xs text-muted-foreground">
              {props.presets.hint}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {props.presets.groups.map((group) => (
              <div key={group.name} className="flex gap-2">
                <span className="w-14 shrink-0 pt-2 text-xs text-muted-foreground">
                  {group.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      onClick={() => presetClick(item)}
                      className="cursor-pointer rounded-md border bg-secondary p-2 text-sm text-muted-foreground shadow transition hover:scale-[1.03] dark:border-0 dark:text-foreground/80 dark:shadow-none"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {props.question && (
        <div className="flex truncate rounded-md border bg-secondary p-2 shadow dark:border-0 dark:shadow-none">
          {props.icon ?? (
            <Image
              width={24}
              height={24}
              className="mr-2"
              src="/img/yin-yang.webp"
              alt="yinyang"
            />
          )}
          {props.question}
        </div>
      )}
    </div>
  );
}

export default Question;
