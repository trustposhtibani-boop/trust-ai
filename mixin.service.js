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

  const products = data.data || [];

  return products.find(product =>
    (product.name || "").toLowerCase().includes(name.toLowerCase()) ||
    (product.english_name || "").toLowerCase().includes(name.toLowerCase())
  );
}

module.exports = {
  getProducts,
  findProductByName
};
