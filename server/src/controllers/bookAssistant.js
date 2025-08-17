import { config } from "../config/config.js";

const createBookAssistant = async (req, res) => {
  const { message } = req.body;

  // Call OpenAI (or other LLM) with message
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openAPIKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful book assistant." },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();
  console.log("OpenAI API Response:", data); // 🔎 DEBUGGING

  if (!data.choices) {
    return res
      .status(500)
      .json({ error: "No choices returned from OpenAI", details: data });
  }

  res.json({ reply: data.choices[0].message.content });
};

export { createBookAssistant };
