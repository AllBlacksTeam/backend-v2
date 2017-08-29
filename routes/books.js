var express = require('express');
var bookRouter = express.Router();
var Book = require('../models/book');

//we create a function so we could insert any parameter we want from server.js to it
//we could just cut and paste the routes from server.js without creating the paquete function
var paquete = function() {

    //this is a middleware to avoid repetition in the routes below.
    bookRouter.use('/:bookId', function(req, res, next) {
        Book.findById(req.params.bookId, function(err, data) {
            if(err) {
                res.status(500).send(err);
            } else if(data){
                req.data = data;
                next();
            } else {
                res.status(404).send('data not found');
            }
        })
    });

    //create a new item
    //list all or list search results
    bookRouter.route('/')
        .post(function(req, res) {
            var book = new Book(req.body);
            book.save();
            //status 201 means "item created"
            res.status(201).send(book);

        })
        .get(function(req, res) {

            //we use query for search: /api/books?genre=Novel
            var query = {};

            if (req.query.genre) {
                query.genre = req.query.genre;
            }

            Book.find(query, function(err, data) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    res.json(data);
                }
            })
        });

    //show one
    bookRouter.route('/:bookId')
        .get(function(req, res) {
            res.json(req.data);
        })
        .put(function(req, res) {
             req.data.title = req.body.title;
             req.data.author = req.body.author;
             req.data.genre = req.body.genre;
             req.data.read = req.body.read;
             req.data.save(function(err) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.data);
                }
             });
        })
        .patch(function(req, res) {

            //we prevent the user from updating the _id field
            if(req.body._id) {
               delete(req.body._id);
            }

            for(key in req.body) {
                req.data[key] = req.body[key];
            }

            req.data.save(function(err) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.data);
                }
            });
        })
        .delete(function(req, res) {
            req.data.remove(function(err) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    //status 204 means "item removed"
                    res.status(204).send('book removed');
                }

            })
        });

    //it's necessary to add this so the paquete function returns something
    return bookRouter;
};

module.exports = paquete;