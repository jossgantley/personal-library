/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const Book = require("../bookModel");
//MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      Book.find({}, (err, books) => {
        if (err) {
          console.log(err);
        }
      })
        .then(books => {
          let booksRes = books.map(book => {
            return new Object({
              _id: book._id,
              title: book.title,
              commentcount: book.comments.length
            });
          });

          res.json(booksRes);
        })
        .catch(err => console.log(err));
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function(req, res, done) {
      const title = req.body.title;

      if (title === undefined) {
        res.status(500);
      }

      const createBook = new Book({
        title
      });
      createBook
        .save()
        .then(result => res.json({ _id: result._id, title: result.title }))
        .catch(err => console.log(err));
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res) {
      Book.deleteMany({}, err => {
        console.log(err);
      })
        .then(() => res.send("complete delete successful"))
        .catch(err => console.log(err));
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      let bookid = req.params.id;

      Book.find({ _id: bookid }, (err, book) => {
        if (err) {
          console.log(err);
          res.status(500).send("no book exists");
        }
      })
        .then(book => {
          if (book.length == 0) {
            res.status(500).send("no book exists");
          } else {
            res.json({
              _id: book[0]._id,
              title: book[0].title,
              comments: book[0].comments
            });
          }
        })
        .catch(err => console.log(err));

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      Book.findById(bookid, (err, book) => {
        if (err) {
          console.log(err);
        }
        book.comments.push(comment);

        book
          .save()
          .then(book =>
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comments
            })
          )
          .catch(err => console.log(err));
      });
      //json res format same as .get
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid)
        .then(() => res.send("delete successful"))
        .catch(err => console.log(err));
      //if successful response will be 'delete successful'
    });
};
