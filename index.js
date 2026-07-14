require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    project: "Trust AI",
    message: "AI Assistant is running successfully 🚀"
  });
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Trust AI is running on port ${PORT}`);
});
