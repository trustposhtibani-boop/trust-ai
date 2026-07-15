require("dotenv").config();

const express = require("express");

const { askAI } = require("./openai.service");

const {
    getProducts,
    findProductByName,
    updateProductSEO
} = require("./mixin.service");

const { generateSEO } = require("./seo.service");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/* HOME */
app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "Trust AI",
        status: "online",
        version: "2.0"
    });
});

/* TEST */
app.get("/test", (req, res) => {
    res.send("OK");
});

/* PRODUCTS */
app.get("/products", async (req, res) => {
    try {
        const products = await getProducts();

        res.json({
            success: true,
            count: products.data?.length || 0,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
});

/* ASK AI */
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

/* SEO DRY RUN */
app.post("/seo", async (req, res) => {

    try {

        const { productName } = req.body;

        const product = await findProductByName(productName);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "محصول پیدا نشد."
            });
        }

        const result = await generateSEO(product);

        res.json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/* SAVE SEO */
app.post("/seo/save", async (req, res) => {

    try {

        const { productName } = req.body;

        const product = await findProductByName(productName);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "محصول پیدا نشد."
            });
        }

        const result = await generateSEO(product);

        await updateProductSEO(
            product.id,
            product,
            result.seo
        );

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/* SEO TEST */
app.get("/seo-test", async (req, res) => {

    try {

        const product = await findProductByName(
            "بادی میست زنانه تراست اورا مدل Elizabeth Taylor حجم ۱۰۰ میلی‌لیتر"
        );

        const result = await generateSEO(product);

        res.json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/* SEO ALL */
app.get("/seo/all", async (req, res) => {

    try {

        const products = await getProducts();

        const output = [];

        for (const product of products.data.slice(0,3)) {

            try {

                const result = await generateSEO(product);

                output.push({
                    product: product.name,
                    score: result.score,
                    valid: result.validation.valid
                });

            } catch (err) {

                output.push({
                    product: product.name,
                    error: err.message
                });

            }

        }

        res.json({
            success: true,
            total: output.length,
            result: output
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`🚀 Trust AI running on port ${PORT}`);
});
