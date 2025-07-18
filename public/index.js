function displayStory(data) {
  const output = document.querySelector("#story-output");
  output.textContent = data.story;
}

function getStory(theme) {
  const prompt = `You are a children short story expert. Write a short, engaging funny story for ages 3-7 about ${theme}. Keep it under 300 words.`;

  fetch("/api/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      const output = document.querySelector("#story-output");
      output.textContent = data.story;
    })
    .catch((err) => console.error("Story error:", err));
}
