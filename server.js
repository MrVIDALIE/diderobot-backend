const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// ✅ CORS : autoriser uniquement Netlify
app.use(cors({
  origin: "https://diderobot.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
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
            content: "Tu es DideRobot, un assistant scolaire bienveillant pour des élèves de 4e et 3e..."
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
      return res.status(500).json({ error: "Réponse mal formée de l'API OpenAI", data });
    }

    res.json(data);
  } catch (err) {
    console.error("Erreur /api/chat :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// 🚀 Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend DideRobot en ligne sur le port ${PORT}`));
