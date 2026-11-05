import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="mx-auto flex items-center gap-1 text-xs text-muted-foreground/80">
      <span className="italic">心诚则灵</span>
      <span>·</span>
      <Link href="/privacy" className="underline underline-offset-2">
        隐私说明
      </Link>
    </footer>
  );
}

export default Footer;
