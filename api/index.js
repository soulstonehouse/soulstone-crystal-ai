import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.post('/api/index', async (req, res) => {
  const { birthday, birthtime, language } = req.body;

  if (!birthday || !birthtime || !language) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a crystal matching expert. Based on the user\'s birth info, recommend suitable healing crystals.' },
          { role: 'user', content: `Birth date: ${birthday}, Birth time: ${birthtime}, Language: ${language}` },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

export default app;
