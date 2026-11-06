import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { cardImage, cardInfo, TarotCard } from "@/lib/tarot";

export const CARD_SIZE = "aspect-[3/5] w-[84px] sm:w-[104px]";

export function CardBack() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md border-2 border-amber-200/70 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 shadow">
      <div className="flex h-[86%] w-[80%] items-center justify-center rounded border border-amber-200/40 text-xl text-amber-200/80">
        ✦
      </div>
    </div>
  );
}

// 发牌时背面朝上，revealed 后翻到正面；逆位牌正面旋转 180°
function TarotCardView(props: { card: TarotCard; revealed: boolean }) {
  const info = cardInfo(props.card.id);
  return (
    <div
      className={clsx(
        CARD_SIZE,
        "animate-[tarot-deal_0.5s_ease-out] [perspective:800px]",
      )}
    >
      <div
        className={clsx(
          "relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]",
          props.revealed
            ? "[transform:rotateY(0deg)]"
            : "[transform:rotateY(180deg)]",
        )}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Image
            src={cardImage(props.card.id)}
            alt={info.name}
            width={240}
            height={400}
            unoptimized
            draggable={false}
            className={clsx(
              "h-full w-full rounded-md object-cover shadow",
              props.card.reversed && "rotate-180",
            )}
          />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardBack />
        </div>
      </div>
    </div>
  );
}

export default TarotCardView;
