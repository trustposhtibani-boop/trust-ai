const { askAI } = require("./openai.service");
const { validateSEO } = require("./seo.validator");

async function generateSEO(product) {

    const prompt = `
برای محصول زیر فقط و فقط JSON معتبر تولید کن.

فرمت خروجی:

{
  "seo_title": "",
  "seo_description": "",
  "description": "",
  "analysis": "",
  "tags": [],
  "faq": [],
  "internal_links": [],
  "structured_data": {}
}
`;

    const aiResponse = await askAI(prompt, product);

    let seo;

    try {

        seo = JSON.parse(aiResponse);

    } catch (err) {

        throw new Error("OpenAI JSON Parse Error");

    }

    const validation = validateSEO(seo);

    return {
        seo,
        validation
    };

}

module.exports = {
    generateSEO
};
