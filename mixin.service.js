const axios = require("axios");


const client = axios.create({

    baseURL: "https://trustara.ir/api/v4",

    headers: {

        Authorization: `Api-Key ${process.env.MIXIN_API_KEY}`,

        "Content-Type": "application/json"

    }

});



// دریافت محصولات

async function getProducts() {

    const { data } = await client.get("/products/");

    return data;

}



// پیدا کردن محصول با نام

async function findProductByName(name) {


    const { data } = await client.get("/products/");


    const products = data.data || data;


    return products.find(product =>


        (product.name || "")
        .toLowerCase()
        .includes(name.toLowerCase())


        ||


        (product.english_name || "")
        .toLowerCase()
        .includes(name.toLowerCase())


    );

}



// آپدیت امن SEO

async function updateProductSEO(productId, product, seo) {


    const body = {};



    // SEO TITLE

    if (
        seo.seo_title &&
        seo.seo_title.trim().length > 0
    ) {

        body.seo_title = seo.seo_title;

    }




    // SEO DESCRIPTION

    if (
        seo.seo_description &&
        seo.seo_description.trim().length > 0
    ) {

        body.seo_description = seo.seo_description;

    }




    // DESCRIPTION
    // جلوگیری از پاک شدن توضیحات قبلی

    if (
        seo.description &&
        seo.description.trim().length > 50
    ) {

        body.description = seo.description;

    }




    // ANALYSIS
    // جلوگیری از پاک شدن نقد و بررسی

    if (
        seo.analysis &&
        seo.analysis.trim().length > 50
    ) {

        body.analysis = seo.analysis;

    }




    // TAGS

    if (
        Array.isArray(seo.tags) &&
        seo.tags.length > 0
    ) {

        body.tags = seo.tags;

    }




    const { data } = await client.patch(

        `/products/${productId}/`,

        body

    );



    return data;

}





// آپدیت کامل محصول (برای مرحله بعد)

async function updateProductDescription(productId, product, seo) {


    const body = {


        ...product,



        seo_title:

        seo.seo_title &&
        seo.seo_title.trim().length > 0

        ? seo.seo_title

        : product.seo_title,





        seo_description:

        seo.seo_description &&
        seo.seo_description.trim().length > 0

        ? seo.seo_description

        : product.seo_description,





        description:

        seo.description &&
        seo.description.trim().length > 50

        ? seo.description

        : product.description,





        analysis:

        seo.analysis &&
        seo.analysis.trim().length > 50

        ? seo.analysis

        : product.analysis,





        tags:

        Array.isArray(seo.tags) &&
        seo.tags.length > 0

        ? seo.tags

        : product.tags



    };





    const { data } = await client.patch(

        `/products/${productId}/`,

        body

    );



    return data;

}




module.exports = {


    getProducts,

    findProductByName,

    updateProductSEO,

    updateProductDescription


};
