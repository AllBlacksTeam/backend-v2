var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    read: {
        type: Boolean,
        default: false
    }
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;