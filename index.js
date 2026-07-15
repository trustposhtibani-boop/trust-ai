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

/* ==========================
   HOME
========================== */

app.get("/", (req, res) => {

    res.json({
        success: true,
        project: "Trust AI",
        status: "online",
        version: "2.0"
    });

});

/* ==========================
   TEST
========================== */

app.get("/test", (req, res) => {

    res.send("OK");

});

/* ==========================
   PRODUCTS
========================== */

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
/* ==========================
   ASK AI
========================== */

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

/* ==========================
   GENERATE SEO (DRY RUN)
========================== */

app.post("/seo", async (req, res) => {

    try {

        const { productName } = req.body;

        if (!productName) {
            return res.status(400).json({
                success: false,
                message: "نام محصول ارسال نشده است."
            });
        }

        const product = await findProductByName(productName);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "محصول پیدا نشد."
            });
        }

        const result = await generateSEO(product);

        res.json({
            success: true,
            dryRun: true,
            product: product.name,
            validation: result.validation,
            seo: result.seo
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/* ==========================
   SAVE SEO
========================== */

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

        if (!result.validation.valid) {

            return res.json({
                success: false,
                validation: result.validation
            });

        }

        const saved = await updateProductSEO(
            product.id,
            product,
            result.seo
        );

        res.json({
            success: true,
            message: "SEO با موفقیت ذخیره شد.",
            product: product.name,
            data: saved
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/* ==========================
   SEO TEST
========================== */

app.get("/seo-test", async (req, res) => {
    try {

        const product = await findProductByName(
            "بادی میست زنانه تراست اورا مدل Elizabeth Taylor حجم ۱۰۰ میلی‌لیتر"
        );

        if (!product) {
            return res.json({
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
app.post("/seo/all", async (req, res) => {

    try {

        const products = await getProducts();

        const result = [];

        for (const product of products.data) {

            try {

                const seo = await generateSEO(product);

                if (!seo.validation.valid || seo.score < 90) {

                    result.push({
                        product: product.name,
                        status: "skipped",
                        score: seo.score,
                        warnings: seo.validation.warnings
                    });

                    continue;
                }

                await updateProductSEO(
                    product.id,
                    product,
                    seo.seo
                );

                result.push({
                    product: product.name,
                    status: "saved",
                    score: seo.score
                });

            } catch (err) {

                result.push({
                    product: product.name,
                    status: "error",
                    error: err.message
                });

            }

        }

        res.json({
            success: true,
            total: result.length,
            result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
/* ==========================
   START SERVER
========================== */

app.listen(PORT, () => {

    console.log(`🚀 Trust AI running on port ${PORT}`);

});
