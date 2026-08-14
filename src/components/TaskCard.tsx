import { CalendarDays, Check, Clock, Quote, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Task } from "@/lib/tasks";

/** One extracted task, with its date/time badges and the original command. */
export function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <article
      className={cn(
        "animate-task-in group rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md",
        task.completed && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(task)}
          aria-label={task.completed ? "Mark as active" : "Mark as completed"}
          className={cn(
            "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-muted-foreground/40 transition-all active:scale-90",
            task.completed && "border-primary bg-primary text-primary-foreground",
          )}
        >
          {task.completed && <Check className="size-3.5" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-base font-semibold leading-snug text-foreground",
              task.completed && "line-through",
            )}
          >
            {task.title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge icon={<CalendarDays className="size-3.5" />} label={task.date_text} />
            <Badge icon={<Clock className="size-3.5" />} label={task.time_text} />
          </div>

          {task.original_query && (
            <p className="mt-3 flex items-start gap-1.5 text-xs italic text-muted-foreground">
              <Quote className="mt-0.5 size-3 shrink-0" />
              {task.original_query}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="rounded-full p-2 text-muted-foreground opacity-70 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  const unspecified = label.toLowerCase() === "not specified";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        unspecified
          ? "bg-secondary text-muted-foreground"
          : "bg-primary/15 text-primary",
      )}
    >
      {icon}
      {label}
    </span>
  );
}
