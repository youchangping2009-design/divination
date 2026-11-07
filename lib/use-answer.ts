import { useState } from "react";
import { readStreamableValue, StreamableValue } from "ai/rsc";
import { ERROR_PREFIX } from "@/lib/constant";

type Request = () => Promise<{ data?: StreamableValue<string>; error?: string }>;

export function useAnswer(request: Request) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState("");

  async function run() {
    setError("");
    setCompletion("");
    setIsLoading(true);
    try {
      const { data, error } = await request();
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        let ret = "";
        for await (const delta of readStreamableValue(data)) {
          if (delta?.startsWith(ERROR_PREFIX)) {
            setError(delta.slice(ERROR_PREFIX.length));
            return;
          }
          ret += delta ?? "";
          setCompletion(ret);
        }
      }
    } catch (err: any) {
      setError(err.message ?? err);
    } finally {
      setIsLoading(false);
    }
  }

  return { completion, isLoading, error, run };
}
