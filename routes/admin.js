const express=require('express');
const router=express.Router();

const adminController=require('../controller/admin/script');

router.get('/add-product',adminController.getAddProduct);
router.post('/add-product',adminController.postAddProduct);

router.get('/products',adminController.getProducts);

module.exports=router;