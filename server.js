const express = require('express');
const app = express();

let promptData = {};

app.use(express.json());

app.post('/api/update-prompt-status/:userId', (req, res) => {
  const userId = req.params.userId;
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
    return res.status(400).json({ message: `Your daily limit is complete. Try after ${timeRemaining} hours` });
  }

  res.json({ promptsUsed: promptData[userId].promptsUsed, timeRemaining: 24 - promptData[userId].promptsUsed });
});


app.listen(() => {
  console.log(`Server is running on Vercel`);
});
