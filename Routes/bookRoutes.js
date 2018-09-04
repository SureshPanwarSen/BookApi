var express = require('express');
// ,
//     Book = require('./../models/bookModel');

var routes = function (Book) {

    var bookRouter = express.Router();
    var bookController = require('../controllers/bookController')(Book);


    bookRouter.route('/')
        .post(bookController.post)
        .get(bookController.get)


    bookRouter.use('/:bookId', function (req, res, next) {
        console.log('Book ID :- ', req.params.bookId);
        Book.findById(req.params.bookId, function (err, book) {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send('No book found');
            }
        });
    });

    bookRouter.route('/:bookId')
        .get(function (req, res) {
            res.json(req.book);
        })
        .put(function (req, res) {
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else
                    res.json(req.book);
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;
            for (var p in req.body) {
                req.book[p] = req.body[p];
            }
            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else
                    res.json(req.book);
            });
        })
        .delete(function (req, res) {
        })
        ;
    return bookRouter;
};

module.exports = routes;