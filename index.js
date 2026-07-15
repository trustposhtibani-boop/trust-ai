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


// محتوای موقت تایید نشده
let pendingSEO = null;



/*
HOME
*/

app.get("/", (req, res) => {

    res.json({

        success: true,

        project: "Trust AI",

        status: "online",

        version: "3.1"

    });

});



/*
TEST
*/

app.get("/test", (req, res) => {

    res.send("OK");

});




/*
GET PRODUCTS
*/

app.get("/products", async (req, res) => {


    try {


        const products = await getProducts();


        res.json({

            success: true,

            count: products.data?.length || 0,

            products

        });


    } catch(error) {


        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});





/*
ASK AI
*/

app.post("/ask", async (req, res) => {


    try {


        const answer = await askAI(req.body.prompt);


        res.json({

            success:true,

            answer

        });



    } catch(error) {


        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});






/*
GENERATE SEO
فقط تولید محتوا - بدون ذخیره
*/

app.post("/generate", async (req, res) => {


    try {


        const { productName } = req.body;



        const product = await findProductByName(productName);



        if(!product){


            return res.status(404).json({

                success:false,

                message:"محصول پیدا نشد."

            });


        }




        const result = await generateSEO(product);



        pendingSEO = {


            product,

            seo: result.seo


        };




        res.json({


            success:true,


            message:"محتوا تولید شد و آماده انتشار است.",


            score:result.score,


            validation:result.validation,


            seo:result.seo



        });



    } catch(error) {


        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});





/*
SEO DRY RUN
*/

app.post("/seo", async (req,res)=>{


    try{


        const { productName } = req.body;



        const product = await findProductByName(productName);



        if(!product){


            return res.status(404).json({

                success:false,

                message:"محصول پیدا نشد."

            });


        }



        const result = await generateSEO(product);



        res.json(result);



    }catch(error){



        res.status(500).json({

            success:false,

            error:error.message

        });



    }


});
 
 
/*
SAVE SEO
تولید و ذخیره مستقیم
*/

app.post("/seo/save", async (req,res)=>{


    try{


        const { productName } = req.body;



        const product = await findProductByName(productName);



        if(!product){


            return res.status(404).json({

                success:false,

                message:"محصول پیدا نشد."

            });


        }



        const result = await generateSEO(product);



        const saved = await updateProductSEO(

            product.id,

            product,

            result.seo

        );



        res.json({

            success:true,

            message:"SEO ذخیره شد.",

            data:saved

        });



    }catch(error){



        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});







/*
GENERATE TEST
*/

app.get("/generate-test", async(req,res)=>{


    try{


        const product = await findProductByName(

            "Elizabeth Taylor"

        );



        if(!product){


            return res.json({

                success:false,

                message:"محصول پیدا نشد."

            });


        }



        const result = await generateSEO(product);



        pendingSEO = {

            product,

            seo:result.seo

        };



        res.json({

            success:true,

            message:"محتوا آماده شد.",

            seo:result.seo

        });



    }catch(error){



        res.status(500).json({

            success:false,

            error:error.message

        });



    }


});







/*
PUBLISH CONTENT
انتشار محتوای تایید شده
*/

app.post("/publish", async(req,res)=>{


    try{


        if(!pendingSEO){


            return res.status(400).json({

                success:false,

                message:"ابتدا تولید محتوا انجام شود."

            });


        }



        const saved = await updateProductSEO(

            pendingSEO.product.id,

            pendingSEO.product,

            pendingSEO.seo

        );



        pendingSEO = null;



        res.json({

            success:true,

            message:"محتوا با موفقیت منتشر شد.",

            data:saved

        });



    }catch(error){



        res.status(500).json({

            success:false,

            error:error.message

        });



    }


});








/*
DIRECT SAFE UPDATE

آپدیت دستی امن محصول
*/

app.post("/update-product", async(req,res)=>{


    try{


        const {

            productName,

            seo

        } = req.body;



        if(!productName || !seo){


            return res.status(400).json({

                success:false,

                message:"productName و seo الزامی هستند."

            });


        }



        const product = await findProductByName(productName);



        if(!product){


            return res.status(404).json({

                success:false,

                message:"محصول پیدا نشد."

            });


        }



        const saved = await updateProductSEO(

            product.id,

            product,

            seo

        );



        res.json({

            success:true,

            message:"آپدیت امن انجام شد.",

            product:product.name,


            updatedFields:Object.keys(seo)
            .filter(key=>seo[key]),


            data:saved

        });



    }catch(error){



        res.status(500).json({

            success:false,

            error:error.message

        });



    }


});







/*
TEST MULTIPLE PRODUCTS
*/

app.get("/seo/all", async(req,res)=>{


    try{


        const products = await getProducts();


        const output = [];



        for(const product of products.data.slice(0,3)){



            try{


                const result = await generateSEO(product);



                output.push({


                    product:product.name,


                    score:result.score,


                    valid:result.validation.valid


                });



            }catch(err){



                output.push({


                    product:product.name,


                    error:err.message


                });


            }


        }



        res.json({

            success:true,

            total:output.length,

            result:output

        });



    }catch(error){


        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});








/*
SERVER
*/

app.listen(PORT,()=>{


    console.log(

        `🚀 Trust AI running on port ${PORT}`

    );


});
