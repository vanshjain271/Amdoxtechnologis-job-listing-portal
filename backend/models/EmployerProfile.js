const mongoose = require("mongoose");

/**
 * EmployerProfile is stored in its own collection, separate from the User model.
 * It references the User via `userId`. This keeps employer-specific data
 * cleanly separated from auth and job-seeker data.
 */
const employerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },
    companyWebsite: {
      type: String,
      trim: true,
      maxlength: [200, "Website URL cannot exceed 200 characters"],
    },
    companySize: {
      type: String,
      enum: {
        values: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+", ""],
        message: "Invalid company size option",
      },
      default: "",
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid contact email"],
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmployerProfile", employerProfileSchema);