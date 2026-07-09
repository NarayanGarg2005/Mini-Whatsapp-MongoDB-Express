const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  msg: {
    type: String,
    maxLength: 50
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Chat = new mongoose.model("Chat",chatSchema);

module.exports = Chat;