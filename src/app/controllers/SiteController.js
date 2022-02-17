const Product = require('../models/Product')
const Category = require('../models/Category')
const User = require('../models/User')
const Cart = require('../models/Cart')
const Order = require('../models/Order')


class SiteController {

    index(req, res, next) {
        User.find({}).lean()
            .then(users => res.render('home', {
                users: users,
                layout: 'mainUser.hbs'

            }))
            .catch(next)
    }

    async show(req, res, next) {
        try {

            const page = parseInt(req.query.page) || 1;
            const perPage = 6;

            const start = (page - 1) * perPage;
            const end = page * perPage;
            //const totalProducts = await Product.find({});

            var successMsg = req.flash('success')[0]
            //const products = await Product.find({}).populate('Categories').lean().limit(perPage).skip(start).exec()
            let products = await Product.find({}).populate('Categories').lean().exec()
            const categories = await Category.find({}).lean()
            
            if(req.query.hasOwnProperty('_search')){
            
                products = products.filter(product => {
                    return (product.title.toLowerCase().indexOf(req.query._search.toLowerCase()) !== -1) ||
                    (product.Categories.Category_Name.toLowerCase().indexOf(req.query._search.toLowerCase()) !== -1);
                })

               
            }

            if(req.query.hasOwnProperty('_sort')){
                const isValidtype = ['asc', 'desc','new_product'].includes(req.query._sort)
                let method = isValidtype ? req.query._sort : 'desc';
                products = products.sort(function(a,b){
                    var x = parseFloat(a.price);
                    var y = parseFloat(b.price);
                    if(method === 'asc')
                        return x < y ? -1 : x > y ? 1 : 0;
                    else if(method === 'desc')
                        return x > y ? -1 : x < y ? 1 : 0;
                    else if(method === 'new_product'){
                        x = a.createdAt;
                        y = b.createdAt;
                        return new Date(y) - new Date(x);
                    }

                });
               
            }

            const result = products.slice(start, end);
            var totalProducts = products.length;
            
            const order = await Order.find().limit(1)
           
            /*order = order.forEach(itemss => {
                let a = itemss.cart.totalPrice
                console.log(a)
            })*/

            res.render('productUser', {
                products: result,
                categories: categories,
                successMsg: successMsg,
                noMessages: !successMsg,
                pagination: {
                    page: req.query.page || 1,
                    pageCount: Math.ceil(totalProducts / perPage)
                },
                layout: 'mainUser.hbs'
            })

        } catch {
            res.redirect('/')
        }
    }

    async showcategory(req, res, next) {
        try {

            const page = parseInt(req.query.page) || 1;
            const perPage = 6;

            const start = (page - 1) * perPage;
            const end = page * perPage;

            var successMsg = req.flash('success')[0]
            const categories = await Category.find({}).lean()
            Category.findOne({ _id: req.params.id }, function (err, c) {

                Product.find({ Categories: req.params.id }, function (err, products) {
                    
                    
                    if(req.query.hasOwnProperty('_sort')){
                        const isValidtype = ['asc', 'desc','new_product'].includes(req.query._sort)
                        let method = isValidtype ? req.query._sort : 'desc';
                        products = products.sort(function(a,b){
                            var x = parseFloat(a.price);
                            var y = parseFloat(b.price);
                            if(method === 'asc')
                                return x < y ? -1 : x > y ? 1 : 0;
                            else if(method === 'desc')
                                return x > y ? -1 : x < y ? 1 : 0;
                            else if(method === 'new_product'){
                                x = a.createdAt;
                                y = b.createdAt;
                                return new Date(y) - new Date(x);
                            }
        
                        });
                       
                    }
                   
                    var totalProducts = products.length;

                    var result = products.splice(start, end);
                    res.render('productUser', {
                        products: result,
                        categories: categories,
                        successMsg: successMsg,
                        noMessages: !successMsg,
                        pagination: {
                            page: req.query.page || 1,
                            pageCount: Math.ceil( totalProducts / perPage),
                        },
                        layout: 'mainUser.hbs'
                    })
                    
                }).populate('Categories').lean()
            }).lean()
        } catch {
            res.send('ERROR!!!')
        }
    }

    //[GET] product/details/:id
    details(req, res, next) {
        Product.findOne({ _id: req.params.id }).populate('Categories').lean().exec()
            .then(product => res.render('detailProducts', {
                layout: 'mainUser.hbs',
                product: product
            }))
            .catch(next)
    }

    /*async search(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 6;

            const start = (page - 1) * perPage;
            const end = page * perPage;

            var successMsg = req.flash('success')[0]
            const products = await Product.find({}).populate('Categories').lean().exec()
            const categories = await Category.find({}).lean()
            let filterProduct = products.filter(product => {
                return (product.title.toLowerCase().indexOf(req.query.name.toLowerCase()) !== -1) ||
                    (product.Categories.Category_Name.toLowerCase().indexOf(req.query.name.toLowerCase()) !== -1);

            })

            var result = filterProduct.slice(start, end);
            res.render('productUser', {
                products: result,
                categories: categories,
                successMsg: successMsg,
                noMessages: !successMsg,
                pagination: {
                    page: req.query.page || 1,
                    pageCount: Math.ceil(filterProduct.length / perPage)
                },
                layout: 'mainUser.hbs'
            })

        } catch {
            res.send('ERROR!!!')
        }
    }*/

    addToCart(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        
        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect('/');
            }

            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('back');
        })
        
    }
    
    updateQty(req, res, next) {
       var productId = req.query.idPro;
       var newQty = req.query.cartQty;

       var cart = new Cart(req.session.cart ? req.session.cart : {});
       
       cart.updateQuantity(productId, newQty)
       req.session.cart = cart;


       res.redirect('/shopping-cart')

    }

    reduceByOne(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('/shopping-cart')
    }

    removeAll(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('/shopping-cart')
    }

    shoppingCart(req, res, next) {
        if (!req.session.cart) {
            return res.render('shopping-cart', {
                products: null,
                layout: 'mainUser.hbs'
            })
        }
        var cart = new Cart(req.session.cart);
       
        //console.log(cart.totalPrice)
        res.render('shopping-cart', {
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            //totalPrice: cart.totalPrice(),
           //totalQuantity: cart.totalQuantity(),

            
            layout: 'mainUser.hbs'
        })
    }

    checkout(req, res, next) {
        if (!req.session.cart) {
            return res.render('shopping-cart', {
                products: null,
                layout: 'mainUser.hbs'
            })
        }
        var cart = new Cart(req.session.cart);
        console.log(cart.items.qty)
        var errMsg = req.flash('err')[0];
        res.render('checkout', {
            total: cart.totalPrice,
            errMsg: errMsg,
            noErrors: !errMsg,
            layout: 'mainUser.hbs'
        })
    }

    async checkoutSubmit(req, res, next) {
        if (!req.session.cart) {
            return res.render('shopping-cart', {
                layout: 'mainUser.hbs'
            })
        }

        var cart = new Cart(req.session.cart);

        const stripe = require('stripe')('sk_test_51J2uFCGskmFMDsQnQdapHOLvBZWXzcfSJWO4084WtzGPUgwfCduBcQjXkck6VqH8ClD0oxBiXaYy6DzPoH3Az7WB00DrIQ984z');

        // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
        const charge = await stripe.charges.create({
            amount: cart.totalPrice * 100,
            currency: 'usd',
            source: req.body.stripeToken,
            description: 'My First Test Charge',
        }, function (err, charge) {
            if (err) {
                req.flash('err', err.message);
                return res.redirect('back');
            }
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentId: charge.id
            });
            order.save(function (err, result) {
                req.flash('success', 'Successfully bought products')
                req.session.cart = null;
                res.redirect('/productUser')
            })

        });
    }
}

module.exports = new SiteController;