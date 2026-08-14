import { Sparkles } from "lucide-react";

const SAMPLES = [
  "Remind me to call John tomorrow at 5 PM",
  "Submit assignment on Friday by 11 AM",
  "Team standup Monday 9:30 AM",
  "Pay rent on the 1st",
];

/** Quick-fill pills so the app can be tested without speaking. */
export function SampleCommands({
  onPick,
  disabled,
}: {
  onPick: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="size-3.5" />
        Sample voice commands
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((sample) => (
          <button
            key={sample}
            type="button"
            disabled={disabled}
            onClick={() => onPick(sample)}
            className="rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs text-secondary-foreground transition-all hover:border-primary/60 hover:bg-accent active:scale-[0.97] disabled:opacity-50"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
