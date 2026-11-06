import { ChatGPT } from "@/components/svg";
import { ModeToggle } from "@/components/mode-toggle";
import Nav from "@/components/nav";

export default function Header() {
  return (
    <header className="h-14 bg-secondary py-2 shadow">
      <div className="mx-auto flex h-full w-[90%] items-center justify-between sm:w-full sm:max-w-md md:max-w-2xl">
        <div className="flex gap-2">
          <ChatGPT />
          <span>AI 占卜</span>
        </div>
        <Nav />
        <ModeToggle />
      </div>
    </header>
  );
}
