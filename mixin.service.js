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

module.exports = {
  getProducts
};
