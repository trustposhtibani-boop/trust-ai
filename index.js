require("dotenv").config();

const express = require("express");
const { askAI } = require("./openai.service");
const { getProducts } = require("./mixin.service");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.json({
    status: "online",
    project: "Trust AI",
    message: "AI Assistant is running successfully 🚀"
  });
});


app.post("/ask", async (req, res) => {
  try {
    const result = await askAI(req.body.prompt);

    res.json({
      success: true,
      answer: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await getProducts();

    res.json({
      success: true,
      products: products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});


app.listen(PORT, () => {
  console.log("Trust AI running on port", PORT);
});
