# Voice-to-Task App

A voice/natural-language task capture app: speak or type a command, AI extracts a clean task title, date, and time, and it lands in a structured task feed.

## Platform note

This project runs on the web stack (React + Vite + TanStack Start), not React Native/Expo — Expo isn't supported here. The app will be built as a fully responsive web app that works like a native app on phones (installable, touch-first, large tap targets), using Tailwind and Lucide icons. Speech input uses the browser's built-in speech recognition, which works in Chrome on Android and desktop; on unsupported browsers the mic button hides and typing still works.

## What gets built

**1. Capture bar (home screen)**
- Large input field with a mic button for live dictation (interim text streams into the field).
- Send button with a loading spinner while the AI is working.
- Row of tappable sample command pills: "Remind me to call John tomorrow at 5 PM", "Submit assignment on Friday by 11 AM", "Team standup Monday 9:30 AM", "Pay rent on the 1st".
- Toast on error (network, AI failure), with a note when the fallback parser was used.

**2. AI extraction**
- The raw sentence is sent to Gemini (via Lovable AI, no API key setup needed) with a system prompt that forces a strict JSON response: `task`, `date`, `time` (with "Not specified" when absent).
- Local regex fallback parser runs if the AI call fails: handles today/tomorrow/tonight, weekday names, `Aug 15`-style dates, `5 PM` / `11:30am` / `at 17:00`, and strips the leading "remind me to / I need to" filler for a clean title.

**3. Task feed**
- Card per task: title, date badge (calendar icon), time badge (clock icon), and the original spoken command shown in smaller muted text underneath.
- Tap the circle to toggle complete (strikethrough + dimmed), trash icon to delete, with smooth transitions.
- Sections for Active and Completed, plus an empty state prompting the first command.
- Tasks persist in the database per user, so they survive reloads.

**4. Design**
- One committed visual direction: deep ink-and-amber, rounded cards, soft shadows, subtle spring animations on card add/remove and a pulsing mic ring while listening. Light and dark themes with a toggle.
- Mobile-first layout, comfortable on desktop with a centered column.

## Technical details

- Enable Lovable Cloud for persistence and anonymous/email auth; `tasks` table (`id`, `user_id`, `title`, `date_text`, `time_text`, `original_query`, `completed`, `created_at`) with RLS scoped to `auth.uid()` and explicit grants.
- Extraction runs in a server function (`src/lib/tasks.functions.ts`) calling the Gemini model through Lovable AI, with `response_format` JSON and a parse guard; the regex fallback lives in a shared module so it also runs client-side if the server call errors.
- Task CRUD via server functions + TanStack Query (`useQuery`/mutations with optimistic updates).
- Speech via `webkitSpeechRecognition`, wrapped in a `useSpeechRecognition` hook that reports unsupported browsers.
- Home page replaces the placeholder at `/`, with its own SEO head metadata.
- Modular components: `CaptureBar`, `SampleCommands`, `TaskCard`, `TaskList`, `ThemeToggle`; commented parsing logic.
