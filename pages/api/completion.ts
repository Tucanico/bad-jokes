import { mistral } from "@/lib/mistral";
import { rateLimit } from "@/lib/rateLimit";
import { MAX_WORDS, MIN_WORDS, WORDS } from "@/lib/words";
import { NextApiRequest, NextApiResponse } from "next";

const ALLOWED_WORDS = new Set(WORDS.map((word) => word.toLowerCase()));

function parseWords(body: unknown): string[] | null {
  const words = (body as { words?: unknown } | null)?.words;
  if (!Array.isArray(words)) return null;
  if (words.length < MIN_WORDS || words.length > MAX_WORDS) return null;

  const lowered = words.map((word) =>
    typeof word === "string" ? word.toLowerCase() : ""
  );
  const allAllowed = lowered.every((word) => ALLOWED_WORDS.has(word));
  const unique = new Set(lowered).size === lowered.length;
  return allAllowed && unique ? lowered : null;
}

export default async function completion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const words = parseWords(req.body);
  if (!words) {
    return res.status(400).json({
      error: `Pick ${MIN_WORDS} to ${MAX_WORDS} different words from the cards`,
    });
  }

  // Checked after validation so only requests that would reach Mistral use up the quota.
  // x-forwarded-for is set by the hosting proxy; it can be spoofed if the app is ever exposed
  // without one.
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientIp =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
      ?.split(",")[0]
      .trim() ||
    req.socket.remoteAddress ||
    "unknown";
  const limit = await rateLimit(clientIp);
  if (!limit.ok) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    return res.status(429).json({ error: "Too many jokes, try again in a minute" });
  }

  const prompt = `Write me a joke with ${words.join(", ")}. Max 30 words. Plain text only, no markdown or emojis.`;

  try {
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      maxTokens: 50,
    });

    const content = response.choices?.[0]?.message?.content;
    const joke = (
      typeof content === "string"
        ? content
        : (content ?? [])
            .map((chunk) => (chunk.type === "text" ? chunk.text : ""))
            .join("")
    ).trim();

    if (!joke) {
      throw new Error("Mistral returned an empty joke");
    }

    return res.status(200).json({ joke });
  } catch (error) {
    console.error("Joke generation failed", error);
    return res.status(502).json({ error: "Could not get a joke" });
  }
}
