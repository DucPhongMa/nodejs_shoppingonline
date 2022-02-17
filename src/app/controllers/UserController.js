const User = require('../models/User')
const Order = require('../models/Order')
const Cart = require('../models/Cart')

class UserController{


    // [GET] /user/signup
    signup(req, res, next){
        var messages = req.flash('error')
        res.render('user/signup',{
            layout: 'mainUser.hbs',
            csrfToken: req.csrfToken(),
            messages: messages,
            hasErrors: messages.length > 0

        })
    }

    //[POST] /user/store
    /*store(req, res, next){
        res.render('home',{
            layout: 'mainUser.hbs',

        })
    }*/

    signin(req, res, next){
        var messages = req.flash('error')
        res.render('user/signin',{
            layout: 'mainUser.hbs',
            csrfToken: req.csrfToken(),
            messages: messages,
            hasErrors: messages.length > 0
        })
    }

    profile(req, res, next){
        Order.find({user: req.user}).lean()
        .exec(function(err, orders) {
            if(err){
                return res.write('Error!');
            }
            var cart;
            orders.forEach(function (order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('user/profile', { 
                layout: 'mainUser.hbs',
                credentials: 'include',
                orders: orders,
                user: req.user.username,
                isAdmin: req.user.email === 'maducphong7@gmail.com' ? true : false });
        });
    }


    logout(req, res, next){
        req.session.user = null;
        req.session.cart = null;
        req.logout();
       
        res.redirect('/')
    }
}

module.exports = new UserController;