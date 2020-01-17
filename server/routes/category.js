const express = require('express');
const app = express();
const Category = require('../models/category');
const {verifyToken, verifyAdmin} = require('../middlewares/authenticate');

/**
 * Get all caetgories
 */
app.get('/category', (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Category.find({})
        .sort('description')
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }

            Category.count({status: true}, (err, countCategories) => {
                res.json({
                    status: true,
                    categories,
                    total: countCategories
                });
            });
        });
});

/**
 * Get one category
 */
app.get('/category/:id', (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, category) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        res.json({
            status: true,
            category,
        });
    })
});

/**
 * Create category
 */
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    const userId = req.user._id;
    let category = new Category({
        description: body.description,
        user: userId
    });

    category.save((err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (!categoryDb) {
            return res.status(400).json({
                status: false,
                err
            });
        }
        
        res.json({
            status: true,
            category: categoryDb,
        })
    });
});

/**
 * Update category
 */
app.put('/category/:id', [verifyToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let categoryDescription = {
        description : body.description
    }

    Category.findByIdAndUpdate(id, categoryDescription, {new: true, runValidators: true}, (err, categoryDb) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        res.json({
            status: true,
            categoryDb: categoryDb
        })
    });
});

/**
 * Delete category
 */
app.delete('/category/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }
    
        if (!categoryDeleted) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }
        res.json({
            status: true,
            category: categoryDeleted
        });
    });
});

module.exports = app