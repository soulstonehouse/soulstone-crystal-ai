import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { birthday, birthtime, language } = req.body;

  if (!birthday || !birthtime || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `
You are an expert in Bazi (Chinese Astrology) and Crystal Matching. 
Based on the birth date "${birthday}", birth time "${birthtime}", and language "${language}", 
analyze the user's Five Elements (Metal, Wood, Water, Fire, Earth) and recommend 3 crystals that will bring balance and luck. 
Output only the crystal names, and a very short explanation in "${language}".
`;

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional crystal matching AI." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const message = response.data.choices[0].message.content;
    res.status(200).json({ result: message });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}
