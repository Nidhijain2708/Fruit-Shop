const Product = require('../../models/Products');

module.exports.getProfile = (req, res, next) => {
    let accum = 0;
    req.user.cart.map((p) => {
        accum += p.quantity
    })
    res.render('profile', {
        name: req.user.username,
        isAdmin: req.user.isAdmin,
        cartCount: accum
    })
}

module.exports.getProducts = async (req, res, next) => {
    try {
        let products = await Product.find({});
        let accum = 0;
        req.user.cart.map((p) => {
            accum += p.quantity
        })
        res.render('shop/products', {
            products: products,
            isAdmin: req.user.isAdmin,
            cartCount: accum
        });
    }
    catch (err) {
        return next(err);
    }
}

module.exports.getAddToCart = async (req, res, next) => {
    try {
        let { productId } = req.query;
        let indx = -1;
        req.user.cart.forEach((p, i) => {
            if (p.id == productId) indx = i;
        })
        if (indx == -1) {
            req.user.cart.unshift({
                id: productId,
                quantity: 1
            });
        }
        else {
            req.user.cart[indx].quantity += 1;
        }
        await req.user.save();
        let accum = 0;
        req.user.cart.map((p) => {
            accum += p.quantity
        })
        // console.log(accum);
        res.send({
            msg: "Item added success",
            cartCount: accum
        })
    }
    catch (err) {
        return next(err);
    }
}

module.exports.getCart = async (req, res, next) => {
    try {
        let user = await req.user.populate('cart.id');
        let userCart = user.cart;
        // console.log(userCart);
        let accum = 0;
        let totalPrice = 0;
        req.user.cart.map((p) => {
            accum += p.quantity;
            totalPrice += (p.id.price)*(p.quantity);
        })
        res.render('cart', {
            userCart: userCart,
            isAdmin: req.user.isAdmin,
            cartCount: accum,
            totalPrice
        });
    }
    catch (err) {
        return next(err);
    }
}

module.exports.getSearchProduct = async (req, res, next) => {
    try {
        let { productToSearch } = req.body;
        productToSearch = productToSearch.toLowerCase();
        // console.log(productToSearch);
        let products = await Product.find({ name: productToSearch });
        let accum = 0;
        req.user.cart.map((p) => {
            accum += p.quantity
        })
        // console.log(products);
        res.render('afterSearch', {
            products: products,
            isAdmin: req.user.isAdmin,
            cartCount: accum
        })
    }
    catch (err) {
        next(err);
    }
}

module.exports.getRemoveFromCart = async (req, res, next) => {
    try {
        let { productId } = req.query;
        // console.log(productId);
        let indx=-1;
        req.user.cart.forEach((p, i) => {
            if (p.id == productId) indx = i;
        })
        if(req.user.cart[indx].quantity==1){
            let cart=req.user.cart.filter((p) => {
                if (p.id == productId) return false;
                return true;
            })
            req.user.cart=cart;
        }
        else{
            req.user.cart[indx].quantity -= 1;
        }
        // let cart=req.user.cart.filter((p) => {
        //     if (p.id == productId) return false;
        //     return true;
        // })
        // req.user.cart=cart;
        // req.user.cart[indx].quantity -= 1;
        await req.user.save();
        let accum = 0;
        req.user.cart.map((p) => {
            accum += p.quantity
        })
        // console.log(accum);
        res.render('cart',{
            cartCount: accum,
            isAdmin: req.user.isAdmin
        })
    }
    catch (err) {
        return next(err);
    }
}