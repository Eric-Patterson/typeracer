const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  username: String,
  wordsPerMinute: Number,
  time: Number,
  error: Number,
});

// module.exports = mongoose.model("Post", postSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
