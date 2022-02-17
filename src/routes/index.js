const siteRouter = require('./site');
const categoryRouter = require('./categories');
const productRouter = require('./products');
const userRouter = require('./users');


function route(app){

   app.use('/',siteRouter)
   app.use('/category', categoryRouter)
   app.use('/product', productRouter)
   app.use('/user', userRouter)
}

module.exports = route;