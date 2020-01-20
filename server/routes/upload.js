const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                status: false,
                err: {
                    message: 'No ha seleccionado ningun archivo'
                }
            });
    }

    let typesAvailables = ['products', 'users'];

    if (typesAvailables.indexOf(type) < 0) {
        return res.status(400)
            .json({
                status: false,
                err: {
                    message: 'Los tipos permitidos son ' + typesAvailables.join(', ')
                }
            })
    }


    let file = req.files.file;
    let fileSplit = file.name.split('.');
    let extension = fileSplit[fileSplit.length-1];

    let extensions = ['png', 'gif', 'jpg', 'jpeg'];

    if (extensions.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                status: false,
                err: {
                    message: 'Las extensiones permitidas son ' + extensions.join(', ')
                }
            })
    }

    /* File rename */
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`; 
    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    status: false,
                    err
                })
        }

        if (type === 'users') {
            userImage(id, res, fileName);
        } else {
            productImage(id, res, fileName);
        }

    });
})

function userImage(id, res, fileName) {
    User.findById(id, (err, userDb) => {
        if (err) {
            deleteImg(fileName, 'users');
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!userDb) {
            deleteImg(fileName, 'users');
            return res.status(400).json({
                status: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        deleteImg(userDb.img, 'users');

        userDb.img = fileName;
        userDb.save((err, userSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            res.json({
                status: true,
                user: userSave,
                img: fileName
            });
        })

    })
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDb) => {
        if (err) {
            deleteImg(fileName, 'products');
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!productDb) {
            deleteImg(fileName, 'products');
            return res.status(400).json({
                status: false,
                err: {
                    message: 'El product no existe'
                }
            })
        }

        deleteImg(productDb.img, 'products');

        productDb.img = fileName;
        productDb.save((err, productSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            res.json({
                status: true,
                user: productSave,
                img: fileName
            });
        })

    })
}

function deleteImg(fileName, type) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;