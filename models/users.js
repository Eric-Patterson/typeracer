const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// const UserSchema = new Schema({
//   firstName: String,
//   lastName: String,
// });

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // this is not considered a validation, it sets up an index
  },
  wordsPerMinute: Number,
  time: Number,
  error: Number,
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
