const express = require('express');
const router = express.Router();
const csrf = require('csurf')
const passport = require('passport')

const csrfProtection = csrf();
router.use(csrfProtection)

const userController = require('../app/controllers/UserController')


router.get('/profile', isLoggedIn, userController.profile);

router.get('/logout', isLoggedIn, userController.logout);

router.use('/', notLoggedIn, function(req, res, next){
    next()
})

router.get('/signup', userController.signup);
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true

}), function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/signin')
    }
});


router.get('/signin', userController.signin);
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true

}),function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else if(req.session.user.email === 'maducphong7@gmail.com'){
        res.redirect('/product/index')
    }
    else{
        res.redirect('/user/profile')
    }
});

module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}