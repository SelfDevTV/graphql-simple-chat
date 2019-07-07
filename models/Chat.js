const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: String,
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
