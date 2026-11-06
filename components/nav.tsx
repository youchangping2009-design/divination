"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { href: "/", label: "求签", active: "bg-red-700 text-white" },
  { href: "/zhouyi", label: "周易", active: "bg-amber-700 text-white" },
  { href: "/tarot", label: "塔罗", active: "bg-purple-700 text-white" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex rounded-md bg-background/70 p-0.5 text-sm">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={clsx(
            "rounded px-3 py-1 transition-colors",
            pathname === tab.href
              ? tab.active
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
