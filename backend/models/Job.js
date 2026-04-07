const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
    },
    qualifications: {
      type: String,
      required: [true, "Qualifications are required"],
      trim: true,
      maxlength: [3000, "Qualifications cannot exceed 3000 characters"],
    },
    responsibilities: {
      type: String,
      required: [true, "Responsibilities are required"],
      trim: true,
      maxlength: [3000, "Responsibilities cannot exceed 3000 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    salaryRange: {
      type: String,
      required: [true, "Salary range is required"],
      trim: true,
      maxlength: [100, "Salary range cannot exceed 100 characters"],
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: ["full-time", "part-time", "contract", "freelance", "internship"],
        message: "Invalid job type",
      },
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [100, "Experience string cannot exceed 100 characters"],
    },
    skills: {
      type: [String],
      default: [],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search (title, location, and description)
jobSchema.index({ title: "text", location: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
