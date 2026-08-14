import { ListChecks } from "lucide-react";

import { TaskCard } from "@/components/TaskCard";
import type { Task } from "@/lib/tasks";

/** Active + completed sections with an empty state. */
export function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const active = tasks.filter((task) => !task.completed);
  const done = tasks.filter((task) => task.completed);

  if (tasks.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
        <ListChecks className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No tasks yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap the mic or a sample command to capture your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <Section title="Active" count={active.length}>
        {active.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </Section>

      {done.length > 0 && (
        <Section title="Completed" count={done.length}>
          {done.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title} · {count}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
