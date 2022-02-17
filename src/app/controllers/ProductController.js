const Product = require('../models/Product')
const Category = require('../models/Category')
class ProductController{

    async index(req, res, next){

            try{
                const page = parseInt(req.query.page) || 1;
                const perPage = 3;
    
                const start = (page - 1) * perPage;
                const totalProducts = await Product.find({});
                const products = await Product.find({}).populate('Categories').limit(perPage).skip(start).lean()
              
                res.render('product/index', {
                    products: products,
                    pagination: {
                        page: req.query.page || 1,
                        pageCount: Math.ceil(totalProducts.length/perPage)
                    }, 
                })
               
            }catch{
                res.send('ERROR!!!')
            }
    }

    async search(req, res, next){

        try{
            const page = parseInt(req.query.page) || 1;
            const perPage = 3;

            const start = (page - 1) * perPage;
            const end = page * perPage;


            const products = await Product.find({}).populate('Categories').lean().exec()

            let filterProduct = products.filter(product => {
                return (product.title.toLowerCase().indexOf(req.query.name.toLowerCase()) !== -1);
            })

            var result = filterProduct.slice(start, end);

            res.render('product/index', {
                products: result,
                pagination: {
                    page: req.query.page || 1,
                    pageCount: Math.ceil(filterProduct.length/perPage)
                }, 
            })
           
        }catch{
            res.send('ERROR!!!')
        }
}


    // [GET] /product/create
    async create(req, res, next){
        const categories = await Category.find({}).lean()
        res.render("product/create",{
            categories: categories,
        }); 
    }
    
    //[POST] /product/store
    store(req, res, next){
        
        const formData = req.body;
        formData.Image = `\\` + req.file.path.split('\\').splice(5).join('\\');
        const product = new Product(formData);
        product.save()
                .then(() => res.redirect('/product/index'))
                .catch(error => {
                    res.send('ERROR!!!!')})
  
    }
    
    //[GET] product/details/:id
    details(req, res, next){
        Product.findOne({_id: req.params.id}).populate('Categories').lean().exec()
            .then(product => res.render('product/details',{
                product: product
            }))
            .catch(next)
    }

    //[GET] product/edit/:id
    async edit(req, res, next){
        const categories = await Category.find({}).lean()
        Product.findOne({_id: req.params.id}).populate('Categories').lean().exec()
            .then(product => res.render('product/edit',{
                product: product,
                categories: categories
            }))
            .catch(next)
    }

    //[PUT] product/:id
    update(req, res, next){
        const formData = req.body;
        formData.Image = `\\` + req.file.path.split('\\').splice(5).join('\\');
        Product.updateOne({_id: req.params.id}, formData)
            .then(() => res.redirect('/product/index'))
            .catch(next)
    }

    // [DELETE] /product/:id
    destroy(req, res, next){
        Product.deleteOne({_id: req.params.id})
             .then(() => res.redirect('back'))
             .catch(next)
     }
   

}

module.exports = new ProductController;