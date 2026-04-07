const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

// Seeker routes
router.post("/:jobId", protect, applyToJob);
router.get("/my/all", protect, getMyApplications); // Avoid conflict with potential job/:id

// Employer routes
router.get("/job/:jobId", protect, getJobApplications);
router.patch("/:id/status", protect, updateApplicationStatus);

module.exports = router;
