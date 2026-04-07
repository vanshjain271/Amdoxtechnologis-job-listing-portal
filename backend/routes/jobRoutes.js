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
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes (Employer only handled in controller)
router.post("/", protect, createJob);
router.get("/my/all", protect, getMyJobs); // Avoid conflict with /:id
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
