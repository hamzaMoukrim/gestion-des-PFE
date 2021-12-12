const express = require('express');
const ConversationController = require('../contollers/conversationController.js')
const router =express.Router();


router.post('/send',ConversationController.send)
// router.post('/newStudent',usersController.addUser)
router.post("/fetchMessages/:to", ConversationController.fetchMessages);

router.get("/chatList/:user", ConversationController.fetchChatList);

module.exports = router;