require("dotenv").config();

const express = require("express");
const { askAI } = require("./openai.service");
const {
  getProducts,
  findProductByName
} = require("./mixin.service");

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

app.get("/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post("/seo", async (req, res) => {

  try {

    const { productName, prompt } = req.body;

    const product = await findProductByName(productName);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "محصول پیدا نشد."
      });
    }

    const answer = await askAI(prompt, product);

    res.json({
      success: true,
      product: product.name,
      answer
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

app.post("/ask", async (req, res) => {

  try {

    const answer = await askAI(req.body.prompt);

    res.json({
      success: true,
      answer
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
});      success: false,
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
app.get("/test", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log("Trust AI running on port", PORT);
});
