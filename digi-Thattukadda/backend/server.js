import cors from "cors";
import "dotenv/config";
import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let dialogues = [];
try {
  const dialoguesPath = path.join(__dirname, "./data/food_list.json");
  const rawData = fs.readFileSync(dialoguesPath);
  dialogues = JSON.parse(rawData);
  console.log(`Loaded ${dialogues.length} dialogues.`);
} catch (error) {
  console.error("Error loading dialogues JSON:", error);
  console.log(
    "Please ensure 'food_list.json' is in a 'data' subfolder within your 'backend' directory."
  );
}

app.post("/generate-tts", async (req, res) => {
  const { mood } = req.body;
  console.log("Received mood:", mood);

  const filteredDialogues = dialogues.filter((d) => d.mood === mood);
  if (filteredDialogues.length === 0) {
    return res.status(404).json({ error: "No dialogue found for this mood." });
  }

  const selectedDialogue =
    filteredDialogues[Math.floor(Math.random() * filteredDialogues.length)];

  const promptText =
    `${selectedDialogue.speakerA.name} says: ${selectedDialogue.speakerA.text}\n` +
    `${selectedDialogue.speakerB.name} replies: ${selectedDialogue.speakerB.text}`;

  try {
    console.log(`Requesting TTS from Groq for mood: ${mood}`);

    const response = await groq.audio.speech.create({
      model: "playai-tts",
      voice: "Quinn-PlayAI",
      input: promptText,
      response_format: "wav",
    });

    console.log("Successfully received audio data from Groq.");

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.writeHead(200, {
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.length,
    });
    res.end(audioBuffer);
  } catch (error) {
    console.error("Error generating TTS with Groq:", error);
    res
      .status(500)
      .json({ error: "Failed to generate audio.", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
