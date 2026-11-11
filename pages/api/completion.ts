import { mistral } from "@/lib/mistral";
import { NextApiRequest, NextApiResponse } from "next";

export default async function completion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { words } = req.body;

  const orderedWords: string = words.join(", ");

  const prompt = `Write me a joke with ${orderedWords}. Max 30 words. Plain text only, no markdown or emojis.`;

  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request" });
  }

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

  return res.status(200).json({
    data: response,
  });
}
