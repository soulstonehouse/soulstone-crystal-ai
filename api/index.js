import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());  // 使用 CORS，允许所有域名访问
app.use(express.json()); // 支持 JSON 格式的请求体

app.post('/api/index', async (req, res) => {
  try {
    const { birthday, birthtime, language } = req.body;

    if (!birthday || !birthtime || !language) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a crystal matching expert. Based on the user\'s birth info, recommend suitable healing crystals.' },
        { role: 'user', content: `Birth date: ${birthday}, Birth time: ${birthtime}, Language: ${language}` },
      ],
      temperature: 0.7,
    });

    const result = response.data.choices[0].message.content;
    res.status(200).json({ reply: result });

  } catch (error) {
    console.error('Error processing request:', error);  // 输出详细错误信息
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

export default app;
