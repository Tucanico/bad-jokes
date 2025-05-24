import { openai } from "@/lib/openAI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function completion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { words } = req.body;

  const orderedWords: string = words.join(", ");

  const prompt = `Write me a joke with ${orderedWords}. Max 30 words.`;

  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request" });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 50,
  });

  return res.status(200).json({
    data: response,
  });
}
