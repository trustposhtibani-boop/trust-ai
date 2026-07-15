const { askAI } = require("./openai.service");

async function generateSEO(product) {

    const prompt = `
برای محصول زیر فقط JSON معتبر تولید کن.

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
        throw new Error("AI خروجی معتبر JSON تولید نکرد.");
    }

    if (!result.seo) {
        throw new Error("فیلد seo وجود ندارد.");
    }

    return {
        seo: result.seo,
        validation: validateSEO(result.seo),
        score: calculateScore(result.seo)
    };
}

function validateSEO(seo) {

    const warnings = [];

    if (!seo.seo_title)
        warnings.push("عنوان سئو وجود ندارد.");

    if (!seo.seo_description)
        warnings.push("متادیسکریپشن وجود ندارد.");

    if (!seo.description)
        warnings.push("توضیحات محصول وجود ندارد.");

    if (!seo.tags || seo.tags.length < 8)
        warnings.push("حداقل 8 تگ لازم است.");

    if (!seo.faq || seo.faq.length < 5)
        warnings.push("حداقل 5 سوال FAQ لازم است.");

    if (!seo.internal_links || seo.internal_links.length < 2)
        warnings.push("حداقل 2 لینک داخلی لازم است.");

    return {
        valid: warnings.length === 0,
        warnings
    };
}

function calculateScore(seo) {

    let score = 100;

    if (!seo.seo_title) score -= 10;
    if (!seo.seo_description) score -= 10;
    if (!seo.description) score -= 20;
    if (!seo.tags || seo.tags.length < 8) score -= 10;
    if (!seo.faq || seo.faq.length < 5) score -= 10;
    if (!seo.internal_links || seo.internal_links.length < 2) score -= 10;
    if (!seo.structured_data) score -= 10;

    return Math.max(score, 0);
}

module.exports = {
    generateSEO
};
