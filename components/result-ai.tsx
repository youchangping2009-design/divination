import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, RotateCw } from "lucide-react";
import Markdown from "react-markdown";

function ResultAI({
  completion,
  isLoading,
  onCompletion,
  error,
}: {
  completion: string;
  isLoading: boolean;
  onCompletion: () => void;
  error: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyClick() {
    const text = completion.replaceAll("**", "").replace(/^#+\s*/gm, "");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 微信等内置浏览器或非 HTTPS 页面不支持剪贴板 API
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      if (!ok) {
        return;
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    setAutoScroll(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!autoScroll) {
      return;
    }
    scrollTo();
  });

  function scrollTo() {
    requestAnimationFrame(() => {
      if (
        !scrollRef.current ||
        scrollRef.current.scrollHeight ===
          scrollRef.current.clientHeight + scrollRef.current.scrollTop
      ) {
        return;
      }
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    });
  }

  function onScroll(e: HTMLElement) {
    if (!isLoading) {
      return;
    }
    const hitBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 15;
    if (hitBottom === autoScroll) {
      return;
    }
    setAutoScroll(hitBottom);
  }

  return (
    <div className="h-0 w-full flex-1 sm:max-w-md md:max-w-2xl">
      {isLoading && (
        <div className="flex h-0">
          <span className="flex-1" />
          <div className="relative -top-4 flex w-fit items-center pr-1 text-muted-foreground sm:left-2 sm:pr-3">
            <RotateCw size={16} className="animate-spin" />
            <span className="ml-1 text-sm">AI 解卦中...</span>
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        onScroll={(e) => onScroll(e.currentTarget)}
        className="max-h-full overflow-auto rounded-md border p-3 shadow dark:border-0 dark:bg-secondary/90 dark:shadow-none sm:p-5"
      >
        {error ? (
          <div className="text-destructive">
            ಠ_ಠ 请求出错了！
            <br />
            {error}
          </div>
        ) : (
          <Markdown className="prose dark:prose-invert">{completion}</Markdown>
        )}
        {!isLoading && (
          <div className="mt-2 flex items-center justify-between">
            <Button onClick={onCompletion} size="sm">
              <RotateCw size={18} className="mr-1" />
              重新生成
            </Button>
            {completion && !error && (
              <Button onClick={copyClick} size="sm" variant="outline">
                {copied ? (
                  <Check size={18} className="mr-1" />
                ) : (
                  <Copy size={18} className="mr-1" />
                )}
                {copied ? "已复制" : "复制解卦"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultAI;
