const express = require('express');
const router = express.Router();

const categoryController = require('../app/controllers/CategoryController')

router.get('/index',isLoggedIn, categoryController.index);

router.get('/create', categoryController.create);
router.post('/store', categoryController.store);


module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}