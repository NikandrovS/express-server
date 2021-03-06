const multer = require('multer');
const { v4 } = require('uuid');
const fs = require('fs');

fs.existsSync('./uploads') || fs.mkdirSync('./uploads');
fs.existsSync('./uploads/products') || fs.mkdirSync('./uploads/products');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/products')
    },
    filename: (req, file, cb) => {
        const uuid = v4();
        const reg = /[a-zA-Z]{3,4}$/gm;
        const extension = reg.exec(file.originalname);

        let name = uuid + '.' + extension;
        cb(null, name);
    }
});

module.exports = (app) => {
    const product = require('../controllers/prodictItem.controller');

    app.post('/productItem', product.create);

    app.get('/productItemAll', product.findAll);

    app.get('/productItemTitles', product.findTitles);

    app.get('/productItem/:itemId', product.findOne);

    app.put('/productItem/:itemId', product.update);

    app.delete('/productItem/:itemId', product.delete);

    app.post('/productImage', multer({ storage: storageConfig }).single("file"), product.uploadImage);

    app.delete('/productImage', product.deleteImage);
}
