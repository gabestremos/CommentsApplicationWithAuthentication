const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: {
    type: String
  },
  author: {
    type: String,
    author: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
const threadSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      author: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    imgDir: {
      type: String
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);
const Threads = mongoose.model("Thread", threadSchema);
module.exports = Threads;
