import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * CORS 处理器（允许所有来源访问）
 */
function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 或指定来源：https://your-shopify-store.com
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 请求是预检请求，直接返回 200
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Vercel Serverless Function 入口
 */
export default async function handler(req, res) {
  // CORS 处理
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { birthday, birthtime, language } = req.body;

  if (!birthday || !birthtime || !language) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are a crystal matching expert. Based on the user's birth info, recommend suitable healing crystals.",
        },
        {
          role: 'user',
          content: `Birth date: ${birthday}, Birth time: ${birthtime}, Language: ${language}`,
        },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || 'No response';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
