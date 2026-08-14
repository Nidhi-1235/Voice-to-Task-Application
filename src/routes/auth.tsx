import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AudioLines, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · EchoTask Voice-to-Task" },
      {
        name: "description",
        content:
          "Sign in to EchoTask to turn spoken commands into structured tasks with dates and times.",
      },
      { property: "og:title", content: "Sign in · EchoTask" },
      {
        property: "og:description",
        content: "Sign in to capture tasks by voice with AI extraction.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created. You're all set!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  };

  const handleGoogle = async () => {
    setPending(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setPending(false);
      toast.error("Google sign-in failed. Try email instead.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <AudioLines className="size-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">EchoTask</span>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
          <h1 className="text-xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your captured tasks stay synced to your account.
          </p>

          <form onSubmit={handleEmail} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={pending} className="w-full rounded-full">
              {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="secondary"
            className="w-full rounded-full"
            onClick={handleGoogle}
            disabled={pending}
          >
            Continue with Google
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "signin"
              ? "No account yet? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
