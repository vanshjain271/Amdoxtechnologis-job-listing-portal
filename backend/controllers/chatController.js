const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

/**
 * @desc    Get all conversations for logged in user
 * @route   GET /api/chat/conversations
 * @access  Private
 */
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "fullName role")
      .populate("lastMessage")
      .sort("-updatedAt");

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("getConversations Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get messages for a specific conversation
 * @route   GET /api/chat/messages/:id
 * @access  Private
 */
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id }).sort(
      "createdAt"
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("getMessages Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Send a message
 * @route   POST /api/chat/messages
 * @access  Private
 */
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, conversationId } = req.body;

    let convId = conversationId;

    // 1. Find or create conversation if not exists
    if (!convId) {
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, receiverId],
        });
      }
      convId = conversation._id;
    }

    // 2. Create message
    const message = await Message.create({
      conversationId: convId,
      sender: req.user._id,
      text,
    });

    // 3. Update last message in conversation
    await Conversation.findByIdAndUpdate(convId, { lastMessage: message._id });

    // 4. Create notification for receiver
    const notification = await Notification.create({
      userId: receiverId,
      type: "new_message",
      title: "New Message",
      message: `${req.user.fullName} sent you a message: "${text.substring(0, 30)}..."`,
      link: `/chat/${convId}`,
      data: { senderId: req.user._id, conversationId: convId },
    });

    // 5. Emit via Socket.io
    const io = req.app.get("io");
    if (io) {
      // Emit message to conversation room
      io.to(convId.toString()).emit("message", message);
      // Emit notification to receiver
      io.to(receiverId.toString()).emit("notification", notification);
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("sendMessage Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getConversations, getMessages, sendMessage };
