const express = require('express');
const cors = require('cors'); 
const app = express();

let promptData = {};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from your server'); 
});

app.get('/api/prompt-status/yourUserId', (req, res) => {
  const userId = 'yourUserId'; // Change 'yourUserId' to the actual user's ID
  if (!promptData[userId]) {
    promptData[userId] = { promptsUsed: 0, lastPromptTime: 0 };
  }

  const currentTime = Date.now();
  const { promptsUsed, lastPromptTime } = promptData[userId];
  const elapsedTime = currentTime - lastPromptTime;

  if (elapsedTime >= 24 * 60 * 60 * 1000) {
    promptData[userId] = { promptsUsed: 1, lastPromptTime: currentTime };
  } else if (promptsUsed < 6) {
    promptData[userId] = { promptsUsed: promptsUsed + 1, lastPromptTime: currentTime };
  } else {
    const timeRemaining = Math.max(0, 24 - Math.floor(elapsedTime / (1000 * 60 * 60)));
    return res.status(400).json({ promptsUsed: promptData[userId].promptsUsed, timeRemaining });
  }

  res.json({ promptsUsed: promptData[userId].promptsUsed, timeRemaining: 24 - promptData[userId].promptsUsed });
});

module.exports = app;
