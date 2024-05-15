const express=require('express');
const router=express.Router();
const shopController=require('../controller/shop/shopController');

router.get('/profile',shopController.getProfile);
router.get('/products',shopController.getProducts);
router.get('/addToCart',shopController.getAddToCart);
router.get('/removeFromCart',shopController.getRemoveFromCart);
router.get('/cart',shopController.getCart);
router.post('/searchProduct',shopController.getSearchProduct);

module.exports=router;