// api/webhook.js

import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const userMessage = req.body.text || req.body.fulfillmentInfo?.tag || "Hi";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({
      fulfillment_response: {
        messages: [{ text: { text: [botReply] } }],
      },
    });
  }

  res.status(200).json({ message: "Webhook running properly" });
}
