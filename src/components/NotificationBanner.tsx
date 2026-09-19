import { Bell, BellOff, BellRing } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NotificationState } from "@/hooks/useTaskReminders";

/** Small prompt/status strip for due-task alerts. */
export function NotificationBanner({
  permission,
  onEnable,
}: {
  permission: NotificationState;
  onEnable: () => void;
}) {
  if (permission === "granted") {
    return (
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <BellRing className="size-3.5 text-primary" />
        Alerts are on — you'll be notified when a task is due.
      </p>
    );
  }

  if (permission === "unsupported") return null;

  if (permission === "denied") {
    return (
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <BellOff className="size-3.5" />
        Alerts are blocked in your browser settings. In-app reminders still appear.
      </p>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Bell className="size-3.5 text-primary" />
        Get an alert when a task is due.
      </p>
      <Button size="sm" variant="secondary" className="h-7 rounded-full text-xs" onClick={onEnable}>
        Turn on
      </Button>
    </div>
  );
}
