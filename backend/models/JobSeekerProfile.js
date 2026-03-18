const mongoose = require("mongoose");

/**
 * JobSeekerProfile is stored in its own collection, separate from the User model.
 * It references the User via `userId` so profile data stays decoupled
 * from authentication data — making both easier to evolve independently.
 */
const jobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    // Skills stored as an array of strings e.g. ["React", "Node.js", "MongoDB"]
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [2000, "Experience cannot exceed 2000 characters"],
    },
    education: {
      type: String,
      trim: true,
      maxlength: [1000, "Education cannot exceed 1000 characters"],
    },
    // resumeURL is the path/filename set after multer upload
    resumeURL: {
      type: String,
      default: null,
    },
    linkedin: {
      type: String,
      trim: true,
      maxlength: [200, "LinkedIn URL cannot exceed 200 characters"],
    },
    github: {
      type: String,
      trim: true,
      maxlength: [200, "GitHub URL cannot exceed 200 characters"],
    },
    portfolio: {
      type: String,
      trim: true,
      maxlength: [200, "Portfolio URL cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobSeekerProfile", jobSeekerProfileSchema);