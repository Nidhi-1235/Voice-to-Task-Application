import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { parseTaskLocally, NOT_SPECIFIED, type ExtractedTask } from "./parse-task";

const schema = z.object({
  task: z.string(),
  date: z.string(),
  time: z.string(),
});

const SYSTEM_PROMPT = `You extract structured task data from a user's spoken or typed command.
Respond strictly with a valid JSON object of the form:
{
  "task": "Clean concise title",
  "date": "Extracted date (e.g. Tomorrow, Aug 15, or Friday)",
  "time": "Extracted time (e.g. 5:00 PM or Not specified)"
}
Rules:
- "task" is a short imperative title with no date/time words and no filler like "remind me to".
- If a date or time is absent, use exactly "Not specified".
- Keep the date phrasing natural, exactly as the user framed it when possible.`;

export interface ExtractionResult extends ExtractedTask {
  /** True when the local regex parser produced the result. */
  usedFallback: boolean;
}

function normalize(value: ExtractedTask, input: string): ExtractedTask {
  return {
    task: value.task?.trim() || parseTaskLocally(input).task,
    date: value.date?.trim() || NOT_SPECIFIED,
    time: value.time?.trim() || NOT_SPECIFIED,
  };
}

export async function extractWithAi(input: string): Promise<ExtractionResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];

  // No key configured -> straight to the deterministic local parser.
  if (!apiKey) {
    return { ...parseTaskLocally(input), usedFallback: true };
  }

  try {
    const gateway = createLovableAiGatewayProvider(apiKey);
    const result = streamText({
      model: gateway("google/gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      prompt: input,
      output: Output.object({ schema }),
    });

    const output = await result.output;
    return { ...normalize(output as ExtractedTask, input), usedFallback: false };
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return { ...parseTaskLocally(input), usedFallback: true };
    }

    const message = error instanceof Error ? error.message : String(error);
    // Surface billing / rate-limit problems so the UI can explain them.
    if (message.includes("429") || message.includes("402")) {
      throw new Error(
        message.includes("402")
          ? "AI credits exhausted. Add credits to keep using AI extraction."
          : "AI is rate limited right now. Try again in a moment.",
      );
    }

    console.error("[extractWithAi] falling back to local parser:", message);
    return { ...parseTaskLocally(input), usedFallback: true };
  }
}
