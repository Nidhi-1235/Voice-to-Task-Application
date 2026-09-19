import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getTaskDueAt } from "@/lib/due-date";
import type { Task } from "@/lib/tasks";

const STORAGE_KEY = "echotask.alerted";
const CHECK_INTERVAL_MS = 20_000;
/** Tasks that came due within this window still alert (covers a closed tab). */
const GRACE_MS = 10 * 60 * 1000;

export type NotificationState = "unsupported" | "default" | "granted" | "denied";

function readAlerted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

function writeAlerted(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* storage unavailable — reminders simply repeat next session */
  }
}

/**
 * Watches the task list and raises an in-app toast plus a desktop notification
 * when a task's extracted date/time arrives. Each task alerts once per device.
 */
export function useTaskReminders(tasks: Task[]) {
  const [permission, setPermission] = useState<NotificationState>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as NotificationState);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as NotificationState);
    if (result === "granted") {
      toast.success("Reminders on — we'll alert you when a task is due.");
    } else if (result === "denied") {
      toast.error("Notifications are blocked in your browser settings.");
    }
  }, []);

  useEffect(() => {
    if (tasks.length === 0) return;

    const check = () => {
      const now = Date.now();
      const alerted = readAlerted();
      let changed = false;

      for (const task of tasks) {
        if (task.completed || alerted.has(task.id)) continue;
        const due = getTaskDueAt(task.date_text, task.time_text);
        if (!due) continue;

        const diff = now - due.getTime();
        if (diff < 0 || diff > GRACE_MS) continue;

        alerted.add(task.id);
        changed = true;

        const body = [task.date_text, task.time_text]
          .filter((value) => value && value !== "Not specified")
          .join(" · ");

        toast(`⏰ ${task.title}`, { description: body || "Due now", duration: 10_000 });

        if ("Notification" in window && Notification.permission === "granted") {
          try {
            new Notification("EchoTask reminder", { body: `${task.title}\n${body}` });
          } catch {
            /* some browsers require a service worker — the toast still shows */
          }
        }
      }

      if (changed) writeAlerted(alerted);
    };

    check();
    const id = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [tasks]);

  return { permission, requestPermission };
}
