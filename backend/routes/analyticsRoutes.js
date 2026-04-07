const express = require("express");
const router = express.Router();
const {
  getEmployerAnalytics,
  getSeekerAnalytics,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Employer analytics
router.get("/employer", protect, authorize("employer"), getEmployerAnalytics);

// Seeker analytics
router.get("/seeker", protect, authorize("jobseeker"), getSeekerAnalytics);

module.exports = router;
