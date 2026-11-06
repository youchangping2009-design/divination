import React from "react";
import clsx from "clsx";
import { Jiao } from "@/lib/qian";

const STICK_TIPS = [18, 27, 36, 45, 54];

export function QianTube(props: { className?: string }) {
  return (
    <svg viewBox="0 0 72 110" className={props.className} aria-hidden>
      {STICK_TIPS.map((x, i) => (
        <g key={x} transform={`rotate(${(i - 2) * 6} ${x} 40)`}>
          <rect
            x={x - 2.5}
            y={4 + (i % 2) * 5}
            width="5"
            height="50"
            rx="2"
            fill="#e8c98a"
          />
          <rect
            x={x - 2.5}
            y={4 + (i % 2) * 5}
            width="5"
            height="9"
            rx="2"
            fill="#b91c1c"
          />
        </g>
      ))}
      <path d="M10 34 H62 L58 104 Q36 110 14 104 Z" fill="#b91c1c" />
      <rect x="10" y="32" width="52" height="7" rx="2" fill="#d4a017" />
      <rect x="13" y="92" width="46" height="5" fill="#d4a017" opacity="0.85" />
      <text
        x="36"
        y="72"
        textAnchor="middle"
        fontSize="15"
        fill="#fde68a"
        style={{ writingMode: "vertical-rl" }}
      >
        靈籤
      </text>
    </svg>
  );
}

export function QianStick(props: { label: string; className?: string }) {
  return (
    <div
      className={clsx(
        "flex h-36 w-7 flex-col items-center rounded-sm bg-[#e8c98a] shadow sm:h-40",
        props.className,
      )}
    >
      <div className="h-6 w-full rounded-t-sm bg-red-700" />
      <span className="mt-2 text-sm font-medium text-red-900 [writing-mode:vertical-rl]">
        {props.label}
      </span>
    </div>
  );
}

// 凸面朝上画成拱形（朱红），平面朝上画成碗形（木色）
function JiaoPiece(props: { flat: boolean }) {
  return (
    <svg viewBox="0 0 60 30" className="h-8 w-16" aria-hidden>
      {props.flat ? (
        <path
          d="M2 6 Q30 46 58 6 Z"
          fill="#e8c98a"
          stroke="#a16207"
          strokeWidth="1.5"
        />
      ) : (
        <path
          d="M2 26 Q30 -14 58 26 Z"
          fill="#b91c1c"
          stroke="#7f1d1d"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

const FACES: Record<Jiao, [boolean, boolean]> = {
  圣杯: [true, false],
  笑杯: [true, true],
  阴杯: [false, false],
};

export function JiaoPair(props: { result: Jiao | null; tossing: boolean }) {
  const faces = props.result ? FACES[props.result] : [true, false];
  return (
    <div className="flex items-end gap-6">
      {faces.map((flat, i) => (
        <div
          key={i}
          className={clsx(props.tossing && "animate-[jiao-toss_1.1s_ease-out]")}
          style={props.tossing ? { animationDelay: `${i * 70}ms` } : undefined}
        >
          <JiaoPiece flat={flat} />
        </div>
      ))}
    </div>
  );
}
