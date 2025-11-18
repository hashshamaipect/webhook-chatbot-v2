import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // ye line zaroor lagani hai

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.text || req.body.fulfillmentInfo?.tag || "Hi";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }]
    })
  });

  const data = await response.json();
  const botReply = data.choices[0].message.content;

  res.json({
    fulfillment_response: {
      messages: [{ text: { text: [botReply] } }]
    }
  });
});

app.listen(process.env.PORT, () => console.log("Webhook running on port " + process.env.PORT));
