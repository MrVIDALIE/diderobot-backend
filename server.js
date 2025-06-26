const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// ✅ Autoriser uniquement ton site Netlify à accéder à ce backend
app.use(cors({
  origin: "https://diderobot.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message utilisateur manquant." });
    }

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
            content: "Tu es DideRobot, un assistant scolaire bienveillant pour aider les élèves de 4e et 3e à réviser. Tu poses des questions une par une et expliques avec clarté."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("Réponse vide ou invalide :", data);
      return res.status(500).json({ error: "Réponse invalide d'OpenAI." });
    }

    res.json(data);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur interne du serveur", details: err.message });
  }
});

// ✅ Ne surtout pas oublier cette ligne pour Render !
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => co
