const express = require('express');
const router = express.Router();

const siteController  = require('../app/controllers/SiteController')

router.get('/', siteController.index);

router.get('/productUser', siteController.show);
router.get('/productUser/details/:id', siteController.details);

router.get('/productUser/category/:id', siteController.showcategory);


//router.get('/productUser/search', siteController.search);

router.get('/add-to-cart/:id', siteController.addToCart);
router.get('/update-quantity', siteController.updateQty);

router.get('/reduce/:id', siteController.reduceByOne);
router.get('/remove/:id', siteController.removeAll);

router.get('/shopping-cart', siteController.shoppingCart);

router.get('/checkout', isLoggedIn, siteController.checkout);
router.post('/checkout', isLoggedIn, siteController.checkoutSubmit);







module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin')
}