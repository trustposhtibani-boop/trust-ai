const { askAI } = require("./openai.service");

async function generateSEO(product) {

    const prompt = `
برای محصول زیر فقط JSON معتبر تولید کن.

ساختار خروجی:

{
  "seo": {
    "seo_title": "",
    "seo_description": "",
    "slug": "",
    "canonical": "",
    "h1": "",
    "short_description": "",
    "description": "",
    "features": [],
    "benefits": [],
    "ingredients": [],
    "how_to_use": [],
    "suitable_for": [],
    "faq": [],
    "internal_links": [],
    "related_products": [],
    "image_alt": "",
    "image_name": "",
    "tags": [],
    "structured_data": {}
  }
}

هیچ متن اضافه‌ای قبل یا بعد از JSON ننویس.
`;

    const text = await askAI(prompt, product);

    let result;

    try {

        result = JSON.parse(text);

    } catch (err) {

        throw new Error(
            "AI خروجی معتبر JSON برنگرداند."
        );

    }

    if (!result.seo) {
        throw new Error("فیلد seo در خروجی AI وجود ندارد.");
    }

    const validation = validateSEO(result.seo);

    const score = calculateScore(result.seo);

    return {
        seo: result.seo,
        validation,
        score
    };

}

function validateSEO(seo) {

    const warnings = [];

    if (!seo.seo_title)
        warnings.push("عنوان سئو وجود ندارد.");

    else if (seo.seo_title.length > 60)
        warnings.push("عنوان سئو بیشتر از 60 کاراکتر است.");

    if (!seo.seo_description)
        warnings.push("متادیسکریپشن وجود ندارد.");

    else if (seo.seo_description.length > 155)
        warnings.push("متادیسکریپشن بیشتر از 155 کاراکتر است.");

    if (!seo.description)
        warnings.push("توضیحات محصول وجود ندارد.");

    else if (seo.description.length < 2500)
        warnings.push("توضیحات محصول کوتاه است.");

    if (!seo.tags || seo.tags.length < 8)
        warnings.push("حداقل 8 تگ لازم است.");

    if (!seo.faq || seo.faq.length < 5)
        warnings.push("حداقل 5 سوال FAQ لازم است.");

    if (!seo.internal_links || seo.internal_links.length < 2)
        warnings.push("حداقل 2 لینک داخلی لازم است.");

    if (!seo.features || seo.features.length < 3)
        warnings.push("ویژگی‌های محصول کم است.");

    if (!seo
