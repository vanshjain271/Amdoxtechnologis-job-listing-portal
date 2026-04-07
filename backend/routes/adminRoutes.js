const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllJobs,
  toggleJobStatus,
  deleteUser,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes are protected and admin only
router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobs);
router.patch("/jobs/:id/status", toggleJobStatus);

module.exports = router;
