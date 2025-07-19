const express = require("express");
const router = express.Router();
const axios = require("axios");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "XXphLKNRxvJ1Qa95KBhX";

router.post("/read", async (request, response) => {
  const { text } = request.body;

  try {
    const responseData = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
      }
    );

    response.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.data.length,
    });

    response.send(responseData.data);
  } catch (err) {
    const raw = err?.response?.data;
    if (Buffer.isBuffer(raw)) {
      const decoded = raw.toString("utf-8");
      console.error("ElevenLabs error (decoded):", decoded);
    } else {
      console.error("ElevenLabs error:", err.message || err);
    }
    response.status(500).json({ error: "Failed to generate audio" });
  }
});

module.exports = router;
