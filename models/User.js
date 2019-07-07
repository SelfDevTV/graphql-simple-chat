const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  chats: [mongoose.Schema.Types.ObjectId]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
