function displayStory(data) {
  const output = document.querySelector("#story-output");

  let story = data.story.replace(/\*\*/g, "");

  const firstParagraphEnd =
    story.indexOf("\n\n") !== -1 ? story.indexOf("\n\n") : story.indexOf(".");

  if (firstParagraphEnd !== -1) {
    const title = story.slice(0, firstParagraphEnd).trim();
    const rest = story.slice(firstParagraphEnd).trim();

    story = `<strong>${title}</strong><br><br>${rest}`;
  }

  story = story.replace(/\n/g, "<br>");

  output.innerHTML = story.trim();
}

function getStory(theme) {
  const output = document.querySelector("#story-output");
  const spinner = document.querySelector("#loading-spinner");
  const prompt = `You are a children short story expert. Write a short, engaging funny story for ages 3-7 about ${theme}. Keep it under 300 words and do not include the word count.`;

  output.innerHTML = "";
  spinner.classList.remove("hidden");

  fetch("/api/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      spinner.classList.add("hidden");
      displayStory(data);
    })
    .catch((err) => {
      spinner.classList.add("hidden");
      console.error("Story error:", err);
    });
}
