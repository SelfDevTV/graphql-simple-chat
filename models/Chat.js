const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: String,
  sentBy: mongoose.Schema.Types.ObjectId
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
