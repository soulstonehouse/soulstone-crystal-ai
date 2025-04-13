
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post('/', async (req, res) => {
  const { birthday, birthtime, language } = req.body;

  let prompt = "";

  if (language === "zh") {
    prompt = `请根据中国传统生辰八字，分析出生日期为${birthday}，出生时间为${birthtime}的人。列出五行强弱，并推荐最适合提升财运的水晶手链（包含水晶种类、颜色、推荐理由），要求简明清晰。`;
  } else {
    prompt = `Based on Chinese Bazi (Four Pillars of Destiny), analyze a person born on ${birthday} at ${birthtime}. List element strengths/weaknesses, and recommend the best crystals to enhance wealth luck (including crystal types, colors, and reasons). Keep it simple and clear.`;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).send('ChatGPT Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
