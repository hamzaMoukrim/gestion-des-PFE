const HttpError = require("../models/Http-error");
const Conversation = require("../models/Conversation");
const User = require("../models/user");
const mongoose = require("mongoose");

// send a message

const send = async (req, res, next) => {
  const { user, to, message } = req.body;

  // let chat = {user:user,message:message,time:Date.now()}
  // Check if room already exits

  const conversationExists = await Conversation.findOne({
    $or: [
      {
        $and: [{ user: user }, { to: to }],
      },
      {
        $and: [{ user: to }, { to: user }],
      },
    ],
  });

  // If room exits, then append the message to the conversation

  if (conversationExists) {
    const pushedMessage = await Conversation.findOneAndUpdate(
      {
        $or: [
          {
            $and: [{ user: user }, { to: to }],
          },
          {
            $and: [{ user: to }, { to: user }],
          },
        ],
      },
      {
        $addToSet: {
          chats: { user: user, message: message },
        },
      }
    ).populate("User", "userName");

    res.send(pushedMessage);
  }
  // If not, create a room and append the message
  else {
    var data = {
      user: user,
      to: to,
      chats: [
        {
          user: user,
          message: message,
        },
      ],
    };
    const newCoversation = new Conversation(data);
    const savedConversation = await newCoversation.save();

    res.send(savedConversation);
  }
};

// // Get the chats list
// message.sync = asyncHandler(async (req, res, next) => {
//   const messages = await Message.find({
//     $or: [{ user: req.params.userId }, { to: req.params.userId }],
//   })
//     .populate("user", "name online lastSeen")
//     .populate("to", "name online lastSeen");

//   res.send(messages);
// });

// Fetch the user's chat list
const fetchMessages = async (req, res, next) => {
  // const user = mongoose.Types.ObjectId(req.body.user);

  const { user } = req.body;
  const to = req.params.to;

  // Check if room already exits
  const messages = await Conversation.findOne(
    {
      $or: [
        {
          $and: [{ user: user }, { to: to }],
        },
        {
          $and: [{ user: to }, { to: user }],
        },
      ],
    },
    "chats"
  );

  res.send(messages);
};

// Fetch the user's chat list

const fetchChatList = async (req, res, next) => {
  const user = req.params.user;

  // Check if room already exits

  const messages = await Conversation.find({
    $or: [
      {
        user: user,
      },
      {
        to: user,
      },
    ],
  })
    .populate("user to", "userName")
    .populate("chats.user", "userName");

  let username = await User.findById(messages);

  try {
    let rec;
    for (let i = 0; i < messages.length; i++) {
      rec = await User.findById(messages[i].to);

      // messages[i].to.user=rec.userName
    }
  } catch (error) {
    console.log("errrrroro");
  }

  res.send(messages);
};

exports.send = send;
exports.fetchMessages = fetchMessages;
exports.fetchChatList = fetchChatList;
