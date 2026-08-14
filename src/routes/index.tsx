import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AudioLines, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CaptureBar } from "@/components/CaptureBar";
import { TaskList } from "@/components/TaskList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { extractTask } from "@/lib/tasks.functions";
import { parseTaskLocally } from "@/lib/parse-task";
import {
  deleteTask,
  fetchTasks,
  insertTask,
  setTaskCompleted,
  type Task,
} from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EchoTask — Turn Voice Commands Into Tasks" },
      {
        name: "description",
        content:
          "Speak or type a command and EchoTask extracts a clean task title, date and time into an organised checklist.",
      },
      { property: "og:title", content: "EchoTask — Turn Voice Commands Into Tasks" },
      {
        property: "og:description",
        content:
          "Speak a reminder, get a structured task with date and time badges. AI extraction with an offline fallback parser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <AudioLines className="size-5 text-primary" />
            <span className="font-semibold tracking-tight">EchoTask</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                className="rounded-full"
                onClick={() => supabase.auth.signOut()}
              >
                <LogOut className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-8">
        {loading ? null : user ? <Dashboard userId={user.id} /> : <SignedOutHero />}
      </main>
    </div>
  );
}

function SignedOutHero() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Say it once.
        <span className="block text-primary">Get a structured task.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
        EchoTask listens to a plain sentence like “Remind me to call John tomorrow at 5
        PM” and turns it into a clean task with date and time badges.
      </p>
      <Button asChild size="lg" className="mt-8 rounded-full px-8">
        <Link to="/auth">Get started</Link>
      </Button>
    </section>
  );
}

function Dashboard({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const extract = useServerFn(extractTask);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: fetchTasks,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks", userId] });

  const create = useMutation({
    mutationFn: async (text: string) => {
      // AI extraction first; fall back to the local parser if the call fails.
      let extracted;
      let usedFallback = false;
      try {
        const result = await extract({ data: { text } });
        extracted = result;
        usedFallback = result.usedFallback;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("credits") || message.includes("rate limited")) {
          toast.error(message);
        }
        extracted = parseTaskLocally(text);
        usedFallback = true;
      }

      const task = await insertTask({
        user_id: userId,
        title: extracted.task,
        date_text: extracted.date,
        time_text: extracted.time,
        original_query: text,
      });
      return { task, usedFallback };
    },
    onSuccess: ({ usedFallback }) => {
      invalidate();
      if (usedFallback) {
        toast.info("Parsed offline — AI extraction wasn't available.");
      }
    },
    onError: () => toast.error("Couldn't save that task. Please try again."),
  });

  const toggle = useMutation({
    mutationFn: (task: Task) => setTaskCompleted(task.id, !task.completed),
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't update that task."),
  });

  const remove = useMutation({
    mutationFn: (task: Task) => deleteTask(task.id),
    onSuccess: () => {
      invalidate();
      toast.success("Task deleted");
    },
    onError: () => toast.error("Couldn't delete that task."),
  });

  return (
    <>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight">Capture a task</h1>
      <CaptureBar onSubmit={(text) => create.mutate(text)} pending={create.isPending} />
      {isLoading ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Loading your tasks…
        </p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={(task) => toggle.mutate(task)}
          onDelete={(task) => remove.mutate(task)}
        />
      )}
    </>
  );
}
