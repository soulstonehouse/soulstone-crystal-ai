// backend-crystal-ai.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { birthday, birthtime, language } = req.body;

  if (!birthday || !birthtime || !language) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // 读取 OpenAI 的 API Key，自动从环境变量里取
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个根据出生日期与时间推荐水晶的智能顾问。' },
          { role: 'user', content: `生日：${birthday} 时间：${birthtime} 语言：${language}。请推荐适合的水晶。` }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
