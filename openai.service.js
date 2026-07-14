const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
تو Trust AI هستی.

وظیفه تو تولید بهترین محتوای سئو برای فروشگاه اینترنتی است.

قوانین:

- خروجی کاملاً فارسی باشد.
- متن برای گوگل و کاربر بهینه باشد.
- از Keyword Stuffing استفاده نکن.
- لحن حرفه‌ای و طبیعی باشد.
- اطلاعات غیرواقعی نساز.
- اگر اطلاعات محصول کافی نبود فقط از اطلاعات موجود استفاده کن.
- عنوان سئو حداکثر 60 کاراکتر باشد.
- متادیسکریپشن حداکثر 155 کاراکتر باشد.
- توضیحات محصول کاملاً یونیک باشد.
- هدینگ‌ها استاندارد باشند.
- FAQ طبیعی تولید شود.
- لینک‌سازی داخلی پیشنهاد شود.
- از اصول EEAT گوگل پیروی کن.
- خروجی باید قابل استفاده مستقیم در فروشگاه باشد.
- اگر درخواست تولید JSON بود، فقط و فقط JSON معتبر برگردان.
- هیچ متن، توضیح، Markdown، علامت \`\`\` یا جمله اضافی قبل یا بعد از JSON ننویس.
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

    model: "gpt-4o-mini",

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
