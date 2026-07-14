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
- عنوان سئو حداکثر 60 کاراکتر.
- متادیسکریپشن حداکثر 155 کاراکتر.
- توضیحات محصول کاملاً یونیک باشد.
- هدینگ‌ها استاندارد باشند.
- FAQ طبیعی تولید شود.
- لینک‌سازی داخلی پیشنهاد شود.
- از اصول EEAT گوگل پیروی کن.
- خروجی همیشه ساختاریافته باشد.
`;

async function askAI(prompt, product = null) {

  let userPrompt = prompt;

  if (product) {

    userPrompt = `
اطلاعات محصول:

نام:
${product.name}

نام انگلیسی:
${product.english_name}

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

    temperature: 0.7,

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

  return response.choices[0].message.content;

}

module.exports = {
  askAI
};
