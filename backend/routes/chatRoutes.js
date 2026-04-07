const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.get("/conversations", getConversations);
router.get("/messages/:id", getMessages);
router.post("/messages", sendMessage);

module.exports = router;
