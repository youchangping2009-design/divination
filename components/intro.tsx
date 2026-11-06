import React from "react";
import Image from "next/image";
import { CardBack } from "@/components/tarot-card";
import { QianTube } from "@/components/qian-art";

const BOX =
  "ignore-animate mt-6 flex w-full max-w-md items-center gap-4 rounded-md border p-4 shadow dark:border-0 dark:shadow-none";

export function ZhouyiIntro() {
  return (
    <div className={`${BOX} bg-amber-50/60 dark:bg-secondary`}>
      <Image
        width={56}
        height={56}
        className="shrink-0 animate-[spin_16s_linear_infinite]"
        src="/img/yin-yang.webp"
        alt="yinyang"
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-amber-800 dark:text-amber-500">
          六爻起卦 · 周易解卦
        </h1>
        <p className="text-sm text-muted-foreground">
          心中默念所问之事，抛掷三枚铜钱六次，自下而上成卦，依《周易》经文与朱熹占法解读。
        </p>
      </div>
    </div>
  );
}

export function QianIntro() {
  return (
    <div className={`${BOX} bg-red-50/60 dark:bg-secondary`}>
      <QianTube className="h-16 w-12 shrink-0" />
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-red-800 dark:text-red-400">
          观音灵签 · 一百签
        </h1>
        <p className="text-sm text-muted-foreground">
          心中默念所求之事，摇签后掷筊，得圣杯方为确认，依艋舺龙山寺版签文与签版圣意解读。
        </p>
      </div>
    </div>
  );
}

const FAN = ["-rotate-12 -translate-x-3", "z-10", "rotate-12 translate-x-3"];

export function TarotIntro() {
  return (
    <div className={`${BOX} bg-purple-50/60 dark:bg-secondary`}>
      <div className="relative ml-1 flex h-16 w-16 shrink-0 items-center justify-center">
        {FAN.map((value, index) => (
          <div key={index} className={`absolute h-16 w-10 ${value}`}>
            <CardBack />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-purple-700 dark:text-purple-400">
          韦特塔罗 · 三张牌阵
        </h1>
        <p className="text-sm text-muted-foreground">
          专注于你的问题，洗牌后抽出三张牌，分别代表过去、现在与未来，依
          Waite《塔罗图解》原典牌义解读。
        </p>
      </div>
    </div>
  );
}
