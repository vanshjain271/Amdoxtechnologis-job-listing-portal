const express = require("express");
const router = express.Router();
const {
  createJobSeekerProfile,
  getJobSeekerProfile,
  updateJobSeekerProfile,
  createEmployerProfile,
  getEmployerProfile,
  updateEmployerProfile,
  uploadResume,
  checkProfileExists,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ── Profile existence check (used by Dashboard redirect) ──
router.get("/check", protect, checkProfileExists);

// ── Job Seeker routes ──
router.post("/jobseeker", protect, createJobSeekerProfile);
router.get("/jobseeker", protect, getJobSeekerProfile);
router.put("/jobseeker", protect, updateJobSeekerProfile);

// ── Employer routes ──
router.post("/employer", protect, createEmployerProfile);
router.get("/employer", protect, getEmployerProfile);
router.put("/employer", protect, updateEmployerProfile);

/**
 * Resume upload route.
 * `upload.single("resume")` is the multer middleware.
 * "resume" must match the field name used in the FormData on the frontend.
 * It runs before the controller and populates req.file if upload succeeds.
 */
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;