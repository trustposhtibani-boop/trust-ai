const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function askAI(prompt) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "تو Trust AI هستی؛ دستیار هوشمند فروشگاه Trust. متخصص SEO، تولید محتوا و بهینه‌سازی محصولات هستی."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = {
  askAI
};
