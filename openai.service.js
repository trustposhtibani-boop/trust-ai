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

قوانین:

- فقط JSON معتبر برگردان.
- هیچ متن اضافه، Markdown یا \`\`\` ننویس.
- هیچ اطلاعاتی را حدس نزن.
- اگر اطلاعاتی وجود ندارد مقدار خالی قرار بده.

همیشه این ساختار را کامل تولید کن:

seo_title
seo_description
slug
canonical
h1
short_description
description
features
benefits
ingredients
how_to_use
suitable_for
faq
internal_links
related_products
image_alt
image_name
tags
structured_data

قوانین کیفیت:

- عنوان سئو حداکثر 60 کاراکتر.
- متادیسکریپشن حداکثر 155 کاراکتر.
- توضیح محصول حداقل 800 کلمه باشد.
- حداقل 8 تگ تولید کن.
- تگ‌ها عبارت‌های جستجوشونده باشند، نه کلمات خیلی عمومی.
- حداقل 5 سوال FAQ تولید کن.
- حداقل 3 ویژگی محصول.
- حداقل 3 مزیت محصول.
- حداقل 2 لینک داخلی پیشنهادی.
- محصولات مکمل پیشنهاد بده.
- ALT تصویر سئو شده باشد.
- Structured Data شامل Product و FAQ باشد.

لحن:

- فارسی روان
- حرفه‌ای
- مناسب فروشگاه لوکس
- مطابق اصول EEAT گوگل
- بدون Keyword Stuffing
- بدون ادعاهای درمانی غیرواقعی

اگر اطلاعات محصول کافی نبود، فقط از اطلاعات موجود استفاده کن و چیزی نساز.
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
}

module.exports = {
  askAI
};
