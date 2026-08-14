import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { extractWithAi } from "./task-extraction.server";

const ExtractInput = z.object({ text: z.string().min(1).max(500) });

/**
 * Server-side AI extraction. Returns the structured task plus a flag telling
 * the UI whether the local fallback parser had to be used.
 */
export const extractTask = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExtractInput.parse(input))
  .handler(async ({ data }) => {
    return extractWithAi(data.text);
  });
