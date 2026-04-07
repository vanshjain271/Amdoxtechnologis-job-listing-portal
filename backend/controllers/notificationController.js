const Notification = require("../models/Notification");

/**
 * @desc    Get all notifications for logged in user
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort("-createdAt")
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("getNotifications Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("markAsRead Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Mark all as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

    res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("markAllAsRead Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
