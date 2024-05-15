const cloudinary = require('cloudinary').v2;
const DatauriParser = require('datauri/parser');
const Product = require('../../models/Products');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.getAddProduct = (req, res, next) => {
    let accum = 0;
    req.user.cart.map((p) => {
        accum += p.quantity
    })
    res.render('addProduct', {
        isAdmin: req.user.isAdmin,
        cartCount: accum
    });
}

module.exports.postAddProduct = async (req, res, next) => {
    let { name, price, description } = req.body;
    console.log(name, price, description)
    name = name.toLowerCase();
    // console.log(req.file);
    // console.log(req.file.buffer);
    try {
        const parser = new DatauriParser();

        cloudinary.uploader.upload(parser.format('.png', req.file.buffer).content, async (error, result) => {
            console.log(result, error);
            // res.send("OK");
            try {
                await Product.create({
                    name,
                    price,
                    description,
                    imageUrl: result.url,
                    userId: req.user._id
                })
                let accum = 0;
                req.user.cart.map((p) => {
                    accum += p.quantity
                })
                res.render('addProduct', {
                    isAdmin: req.user.isAdmin,
                    cartCount: accum
                });
            }
            catch (err) {
                return next(err);
            }
        });
    } catch (err) {
        return next(err);
    }
}

module.exports.getProducts = async (req, res, next) => {
    try {
        let products = await Product.find({});
        let accum=0;
        req.user.cart.map((p)=>{
            accum+=p.quantity
        })
        res.render('admin/products', {
            products: products,
            isAdmin: req.user.isAdmin,
            cartCount: accum
        });
    }
    catch (err) {
        return next(err);
    }
}