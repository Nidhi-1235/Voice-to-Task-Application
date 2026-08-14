import { useState } from "react";
import { Loader2, Mic, MicOff, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SampleCommands } from "@/components/SampleCommands";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

/** Input surface: dictate or type a natural-language command. */
export function CaptureBar({
  onSubmit,
  pending,
}: {
  onSubmit: (text: string) => void;
  pending: boolean;
}) {
  const [value, setValue] = useState("");
  const { supported, listening, start, stop } = useSpeechRecognition(setValue);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/5 sm:p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-2"
      >
        {supported && (
          <Button
            type="button"
            size="icon"
            variant={listening ? "default" : "secondary"}
            onClick={listening ? stop : start}
            aria-label={listening ? "Stop dictation" : "Start dictation"}
            className={cn(
              "size-11 shrink-0 rounded-full transition-transform active:scale-95",
              listening && "animate-mic-pulse",
            )}
          >
            {listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </Button>
        )}

        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={listening ? "Listening…" : "Say or type a task…"}
          aria-label="Task command"
          className="h-11 min-w-0 flex-1 rounded-full bg-secondary/70 px-4 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />

        <Button
          type="submit"
          size="icon"
          disabled={pending || !value.trim()}
          aria-label="Extract task"
          className="size-11 shrink-0 rounded-full transition-transform active:scale-95"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </Button>
      </form>

      <SampleCommands onPick={submit} disabled={pending} />

      {!supported && (
        <p className="mt-3 text-xs text-muted-foreground">
          Voice dictation isn't available in this browser — typing works everywhere.
        </p>
      )}
    </section>
  );
}
