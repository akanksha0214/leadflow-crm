import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const rewriteNote = async (req, res) => {
  try {
    const { notes } = req.body;

    // 🛑 validation
    if (!notes || !notes.trim()) {
      return res.status(400).json({ msg: "Notes are required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a CRM assistant. Rewrite notes clearly, professionally, and concisely.",
        },
        {
          role: "user",
          content: notes,
        },
      ],
      temperature: 0.4,
    });

    const formattedNotes =
      completion.choices[0]?.message?.content;

    if (!formattedNotes) {
      return res
        .status(500)
        .json({ msg: "AI returned empty response" });
    }

    return res.json({ formattedNotes });
  } catch (error) {
    console.error("AI ERROR:", error.message);

    return res.status(500).json({
      msg: "AI failed to format notes",
      error: error.message,
    });
  }
};
