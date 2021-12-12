const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required:true
    },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required:true
  },
  chats: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
         },
      message: String,
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});


module.exports = mongoose.model('Conversation',ConversationSchema);