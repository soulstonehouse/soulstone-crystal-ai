export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { birthday, birthtime, language } = req.body;

  const prompt = `
You are a professional crystal energy advisor.
Based on the following birthday: ${birthday}, birth time: ${birthtime}, and language: ${language}, 
please recommend the most suitable crystals.

If the language is Chinese, reply in Chinese.
If the language is English, reply in English.

Do not explain, just list the crystal names and reasons.
  `;

  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const completion = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a crystal energy expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, no response.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
