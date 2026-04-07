const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort("-createdAt");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("getAllUsers Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get all jobs
 * @route   GET /api/admin/jobs
 * @access  Private (Admin only)
 */
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("postedBy", "fullName email")
      .populate("employerId", "companyName")
      .sort("-createdAt");
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("getAllJobs Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Toggle job status (active/closed)
 * @route   PATCH /api/admin/jobs/:id/status
 * @access  Private (Admin only)
 */
const toggleJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("toggleJobStatus Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Don't delete yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("deleteUser Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getAllUsers, getAllJobs, toggleJobStatus, deleteUser };
