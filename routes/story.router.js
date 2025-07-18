const express = require("express");
const router = express.Router();
const fromCohere = require("../back/cohere");

router.post("/", async (request, response) => {
  const { prompt } = request.body;

  try {
    const story = await fromCohere(prompt);
    response.json({ story });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Unable to generate story" });
  }
});

module.exports = router;
