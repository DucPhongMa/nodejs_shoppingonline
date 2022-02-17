const path = require('path');
const express = require('express');
const multer  = require('multer');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/img'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });
const productController = require('../app/controllers/ProductController')

router.get('/index', productController.index);

router.get('/create', productController.create);
router.post('/store',upload.single('Image'), productController.store);

router.get('/details/:id', productController.details);

router.get('/edit/:id', productController.edit);
router.put('/:id', upload.single('Image'),productController.update);

router.delete('/:id',productController.destroy);

router.get('/search', productController.search);


module.exports = router;