/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new Schema({
  title: String,
  comments: [String]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find().exec((err, books) => {
        if (err) {
          return res.send("error finding books");
        } else {
          let result = books.map(d => {
            return {_id: d._id, title: d.title, commentcount: d.comments.length}
          });
          return result ? res.send(result) : res.send([]);
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.send("missing required field title");
      } else {
        let newBook = new Book({title, comments: []});
        newBook.save((err, book) => {
          if (err) {
            return res.send("error saving book");
          } else {
            return res.send(book);
          }
        })
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, books) => {
        if (err) {
          return res.send('error deleting all books');
        } else {
          return res.send('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) => {
        if (err) {
          return res.send("error finding book by id for get book");
        } else {
          return book ? res.send(book) : res.send("no book exists");
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send("missing required field comment");
      } else {
        Book.findById(bookid, (err, book) => {
          if (err) {
            return res.send("error finding book by id for post comment");
          } else {
            if (!book) {
              return res.send("no book exists")
            } else {
              book.comments.push(comment);
              book.save((err, book) => {
                if (err) {
                  return res.send("error saving book after adding comment");
                } else {
                  return res.send(book);
                }
              });
            }
          }
        });
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid).exec((err, book) => {
        if (err) {
          return res.send("error finding book for deletion");
        } else {
          return book ? res.send("delete successful") : res.send("no book exists");
        }
      })
    });
  
};
