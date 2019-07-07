const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "chat" }]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
