
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { birthday, birthtime, language } = req.body;

  const prompt = `
You are a master of crystal energy. Based on the birth date ${birthday} and birth time ${birthtime}, recommend the best crystals for good fortune. Reply in ${language === 'zh' ? 'Chinese' : 'English'}.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Organization': 'org-yae8SFcVGBZYvoJjNF7cD74z'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
