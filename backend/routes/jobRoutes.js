const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");
const { getRecommendedJobs } = require("../controllers/matchController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   GET /api/jobs/recommended
// @access  Private (Job Seeker only)
router.get("/recommended", protect, authorize("jobseeker"), getRecommendedJobs);

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes (Employer only handled in controller)
router.post("/", protect, createJob);
router.get("/my/all", protect, getMyJobs); // Avoid conflict with /:id
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
