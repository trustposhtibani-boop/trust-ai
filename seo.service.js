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
`;

    const text = await askAI(prompt, product);

    const result = JSON.parse(text);

    const validation = validateSEO(result.seo);

    return {
        seo: result.seo,
        validation
    };

}

function validateSEO(seo){

    const warnings = [];

    if(!seo.seo_title || seo.seo_title.length > 60)
        warnings.push("عنوان سئو مناسب نیست.");

    if(!seo.seo_description || seo.seo_description.length > 155)
        warnings.push("متادیسکریپشن مناسب نیست.");

    if(!seo.description || seo.description.length < 2500)
        warnings.push("توضیحات محصول کوتاه است.");

    if(!seo.tags || seo.tags.length < 8)
        warnings.push("تعداد تگ‌ها کم است.");

    if(!seo.faq || seo.faq.length < 5)
        warnings.push("FAQ کافی نیست.");

    if(!seo.internal_links || seo.internal_links.length < 2)
        warnings.push("لینک داخلی کم است.");

    return{
        valid:warnings.length===0,
        warnings
    };

}

module.exports={
    generateSEO
};
