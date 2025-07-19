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
    .then((response) => response.json())
    .then((data) => {
      spinner.classList.add("hidden");
      displayStory(data);
      document.getElementById("controls").classList.remove("hidden");
    })
    .catch((error) => {
      spinner.classList.add("hidden");
      console.error("Story error:", error);
    });
}

let currentAudio;

function readStoryAloud(text) {
  const readButton = document.querySelector("#read-button");
  const buttonText = document.querySelector("#read-button-text");

  if (currentAudio && !currentAudio.paused) {
    return;
  }

  readButton.disabled = true;
  buttonText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> please wait`;

  fetch("/api/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then((response) => response.blob())
    .then((audioBlob) => {
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      currentAudio = new Audio(URL.createObjectURL(audioBlob));
      currentAudio.play();

      currentAudio.onended = () => {
        readButton.disabled = false;
        buttonText.textContent = "🔊 Read the Story";
      };
    })
    .catch((error) => console.error("Audio error:", error));
}

document.getElementById("read-button").addEventListener("click", () => {
  const storyText = document.getElementById("story-output").innerText;
  readStoryAloud(storyText);
});

document.getElementById("pause-button").addEventListener("click", () => {
  const pauseButtonText = document.getElementById("pause-button-text");
  pauseButtonText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Pausing...`;

  setTimeout(() => {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
    }
    pauseButtonText.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
  }, 500);
});

document.getElementById("resume-button").addEventListener("click", () => {
  const resumeButtonText = document.getElementById("resume-button-text");
  resumeButtonText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Resuming...`;

  setTimeout(() => {
    if (currentAudio && currentAudio.paused) {
      currentAudio.play();
    }
    resumeButtonText.innerHTML = `<i class="fa-solid fa-play"></i> Resume`;
  }, 500);
});

document.getElementById("stop-button").addEventListener("click", () => {
  const stopButtonText = document.getElementById("stop-button-text");
  stopButtonText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Stopping...`;

  setTimeout(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;

      const readButton = document.getElementById("read-button");
      const readButtonText = document.getElementById("read-button-text");
      readButton.disabled = false;
      readButtonText.innerHTML = `🔊 Read the Story`;
    }

    stopButtonText.innerHTML = `<i class="fa-solid fa-stop"></i> Stop`;
  }, 500);
});
