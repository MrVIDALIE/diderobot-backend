const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "https://diderobot.netlify.app"
}));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es DideRobot, un coach de révision pour les élèves de 4e et 3e. Tu aides en Maths, Français, Histoire-Géo, SVT, Anglais, Physique-Chimie, Technologie. Tu es bienveillant, pédagogue, et poses des questions une par une. Tu donnes des conseils de révision, proposes des quiz, aides sans donner la réponse tout de suite. Tu ne réponds pas aux sujets hors scolaire et tu cites parfois Denis Diderot pour encourager."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DideRobot backend en ligne sur le port ${PORT}`));
