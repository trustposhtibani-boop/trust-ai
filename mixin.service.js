const axios = require("axios");

const client = axios.create({
  baseURL: "https://trustara.ir/api/v4",
  headers: {
    Authorization: `Api-Key ${process.env.MIXIN_API_KEY}`,
    "Content-Type": "application/json"
  }
});


async function getProducts() {

  const { data } = await client.get("/products/");

  return data;

}


async function findProductByName(name) {

  const { data } = await client.get("/products/");

  const products = data.data || data;

  return products.find(product =>
    (product.name || "").toLowerCase().includes(name.toLowerCase()) ||
    (product.english_name || "").toLowerCase().includes(name.toLowerCase())
  );

}


async function updateProductSEO(productId, product, seo) {

  const body = {

    ...product,

    seo_title: seo.seo_title || "",
    seo_description: seo.seo_description || "",
    description: seo.description || "",
    analysis: seo.analysis || "",
    tags: seo.tags || []

  };


  const { data } = await client.put(
    `/products/${productId}/`,
    body
  );


  return data;

}


// برای انتشار محتوای تایید شده
async function updateProductDescription(productId, product, seo) {

  const body = {

    ...product,

    seo_title: seo.seo_title || "",
    seo_description: seo.seo_description || "",
    description: seo.description || "",
    analysis: seo.analysis || "",
    tags: seo.tags || []

  };


  const { data } = await client.put(
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
