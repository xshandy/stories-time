require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const path = require("path");
const storyRouter = require("./routes/story.router");
const readRouter = require("./routes/read.router");

app.use(cors());
app.use(express.json());

app.use("/api/story", storyRouter);
app.use("/api", readRouter);

app.post("/api/read", async (request, response) => {
  const { text } = request.body;
  console.log("reading this text", text);
  console.log("API key", !!process.env.ELEVEN_API_KEY);
  try {
    const readData = await axios({
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb/stream",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVEN_API_KEY,
      },
      responseType: "stream",
      data: {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
    });

    response.setHeader("Content-Type", "audio/mpeg");
    readData.data.pipe(response);
  } catch (error) {
    console.error("ElevenLabs error:", error?.response?.data || error.message);
    response.status(500).send("Failed to generate speech.");
  }
});

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
