var mongoose = require("mongoose")

const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {type: String},
  comments: {type: [String]}
})

const Book = mongoose.model("Book", bookSchema)

module.exports= Book