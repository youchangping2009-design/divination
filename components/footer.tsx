"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Coffee, X } from "lucide-react";

function Footer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <footer className="mx-auto text-xs text-muted-foreground/80">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-foreground"
      >
        <Coffee size={14} />
        请他喝咖啡
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label="请他喝咖啡"
            className="relative flex w-full max-w-xs flex-col items-center gap-3 rounded-lg bg-background p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="关闭"
              className="absolute right-2 top-2 rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X size={20} />
            </button>
            <span className="text-base font-medium text-foreground">
              请他喝咖啡 ☕️
            </span>
            <Image
              src="/img/coffee-qr.jpg"
              alt="微信赞赏二维码"
              width={548}
              height={541}
              unoptimized
              className="w-full rounded-md"
            />
            <span className="text-sm text-muted-foreground">
              微信扫码，手机上可长按识别
            </span>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
