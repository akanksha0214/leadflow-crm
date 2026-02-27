import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateFollowupReminder = async ({
  leadName,
  followupTime,
  notes,
  executiveName
}) => {
  const prompt = `
You are a CRM assistant.

Write a short internal reminder for ${executiveName}.

Sales Executive: ${executiveName}
Lead: ${leadName}
Scheduled Time: ${followupTime}
Notes: ${notes || "No notes"}

Keep it professional and under 18 words.
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return res.choices[0].message.content.trim();
};
