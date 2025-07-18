require("dotenv").config();
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.CO_API_KEY,
});

async function getStoryFromCohere(prompt) {
  const response = await cohere.chat({
    model: "command-a-03-2025",
    message: prompt,
  });

  return response.text;
}

module.exports = getStoryFromCohere;
