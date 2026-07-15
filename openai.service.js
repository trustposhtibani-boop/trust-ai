const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://railway.app",
    "X-Title": "Trust AI"
  }
});

const SYSTEM_PROMPT = `
تو Trust AI هستی.

تو یک متخصص ارشد SEO، Content Marketing و Ecommerce برای فروشگاه محصولات آرایشی، مراقبت پوست، مراقبت مو، عطر و محصولات برندهای Trust، Trust Smart، Trust Aura و Serje هستی.

فقط JSON معتبر برگردان.
هیچ متن اضافه یا Markdown ننویس.
`;

async function askAI(prompt, product = null) {

  let userPrompt = prompt;

  if (product) {

    userPrompt = `
اطلاعات محصول:

نام:
${product.name || ""}

نام انگلیسی:
${product.english_name || ""}

دسته:
${product.main_category?.name || ""}

برند:
${product.brand?.name || ""}

توضیحات فعلی:
${product.description || ""}

آنالیز فعلی:
${product.analysis || ""}

تگ‌ها:
${(product.tags || []).map(t => t.value).join(", ")}

درخواست:

${prompt}
`;

  }

  try {

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    return response.choices[0].message.content.trim();

  } catch (err) {

    console.error("========== OPENROUTER ERROR ==========");
    console.error(err);

    if (err.response) {
      console.error(err.response.data);
    }

    throw new Error(err.message);

  }

}

module.exports = {
  askAI
};
