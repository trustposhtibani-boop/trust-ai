function validateSEO(data) {

    const warnings = [];

    if (!data.seo_title || data.seo_title.length > 60) {
        warnings.push("SEO Title باید کمتر از 60 کاراکتر باشد.");
    }

    if (!data.seo_description || data.seo_description.length > 155) {
        warnings.push("Meta Description باید کمتر از 155 کاراکتر باشد.");
    }

    if (!data.description || data.description.length < 300) {
        warnings.push("توضیحات محصول خیلی کوتاه است.");
    }

    if (!Array.isArray(data.tags) || data.tags.length < 5) {
        warnings.push("حداقل 5 تگ پیشنهاد شود.");
    }

    return {
        valid: warnings.length === 0,
        warnings
    };

}

module.exports = {
    validateSEO
};
