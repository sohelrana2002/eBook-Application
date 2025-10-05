import { config } from "../config/config.js";

const createBookAssistant = async (req, res) => {
  const { message } = req.body;

  // Call OpenAI (or other LLM) with message
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.groqAPIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // free Groq model
        messages: [
          { role: "system", content: "You are a helpful book assistant." },
          { role: "user", content: message },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log("OpenAI API Response:", data);

  if (!data.choices) {
    return res
      .status(500)
      .json({ error: "No choices returned from OpenAI", details: data });
  }

  res.json({ reply: data.choices[0].message.content });
};

export { createBookAssistant };
