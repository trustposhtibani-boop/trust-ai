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



    if (seo.seo_title) {

        body.seo_title = seo.seo_title;

    }



    if (seo.seo_description) {

        body.seo_description = seo.seo_description;

    }



    if (seo.description) {

        body.description = seo.description;

    }



    if (seo.analysis) {

        body.analysis = seo.analysis;

    }



    if (seo.tags && seo.tags.length > 0) {

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
        seo.seo_title || product.seo_title,


        seo_description:
        seo.seo_description || product.seo_description,


        description:
        seo.description || product.description,


        analysis:
        seo.analysis || product.analysis,


        tags:
        seo.tags || product.tags



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
