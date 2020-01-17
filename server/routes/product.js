const express = require('express');
const app = express();
const Product = require('../models/product');
const {verifyToken} = require('../middlewares/authenticate');

/**
 * Get all products
 */
app.get('/product', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    Product.find({available: true})
        .populate('user', 'name email')
        .populate('category', 'description')
        .skip(from)
        .limit(5)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }

            Product.count({status: true}, (err, countProducts) => {
                res.json({
                    status: true,
                    products,
                    total: countProducts
                });
            });
        });
})

/**
 * Get one product
 */
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }
            if (!product) {
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                status: true,
                product,
            });
    })
})

/**
 * Search product
 */
app.get('/product/search/:param', verifyToken, (req, res) => {
    let param = req.params.param;
    let regex = new RegExp(param, 'i');
    
    Product.find({name: regex})
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }
            res.json({
                status: true,
                products,
            });
        })
})

/**
 * Create product
 */
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;
    const userId = req.user._id;
    let product = new Product({
        name: body.name,
        priceUni: body.price,
        description: body.description,
        category: body.category,
        user: userId
    });

    product.save((err, productDb) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (!productDb) {
            return res.status(400).json({
                status: false,
                err
            });
        }
        
        res.status(201).json({
            status: true,
            product: productDb,
        })
    });
})

/**
 * Update product
 */
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDb) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (!productDb) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productDb.name = body.name;
        productDb.priceUni = body.price;
        productDb.description = body.description;
        productDb.category = body.category;
        productDb.available = body.available;

        productDb.save((err, product) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            }
            res.json({
                status: true,
                product
            })
        });
        
    });
})

/**
 * Delete product
 */
app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let changeAvailable = {
        available: false,
    };
    Product.findByIdAndUpdate(id, changeAvailable, {new: true}, (err, productDeleted) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        if (!productDeleted) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            status: true,
            product: productDeleted
        });
    });
})

module.exports = app