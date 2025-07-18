const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const storyRouter = require("./routes/story.router");

app.use(cors());
app.use(express.json());
app.use("/api/story", storyRouter);

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
