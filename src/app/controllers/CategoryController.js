const Category = require('../models/Category')

class CategoryController{

    index(req, res, next){
       Category.find({}).lean()
            .then(categories => res.render('category/index',{
                categories: categories,
            }))
            .catch(next)
    }

    // [GET] /category/create
    create(req, res, next){
        res.render("category/create"); 
    }
    
    //[POST] /category/store
    store(req, res, next){
        const formData = req.body;
        const category = new Category(formData);
        category.save()
                .then(() => res.redirect('/category/index'))
                .catch(error => {
                    res.send('ERROR!!!!')})
  
    }

}

module.exports = new CategoryController;