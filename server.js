
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "https://diderobot.netlify.app",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message utilisateur manquant." });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `### Élève : ${userMessage}\n\n### DideRobot :`
      })
    });

    const data = await response.json();
    const reply = data?.[0]?.generated_text?.split("### DideRobot :")[1]?.trim();

    if (!reply) {
      return res.status(500).json({ error: "Réponse vide du modèle." });
    }

    res.json({ choices: [{ message: { content: reply } }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la requête Hugging Face" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend DideRobot (Hugging Face) actif sur le port ${PORT}`));
