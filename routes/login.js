const express=require('express');
const router=express.Router();
const passport = require('../auth/passport');

const loginController=require('../controller/login/script');

router.get('/',loginController.getLogin);
router.post('/',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function(req,res){
        res.redirect('/shop/products');
    });

module.exports=router;