const JobSeekerProfile = require("../models/JobSeekerProfile");
const EmployerProfile = require("../models/EmployerProfile");
const path = require("path");
const fs = require("fs");

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Parses the `skills` field from incoming request body.
 * The frontend may send skills as a comma-separated string or as an array.
 */
const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((s) => s.trim()).filter(Boolean);
  if (typeof skills === "string")
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

// ─────────────────────────────────────────────
// JOB SEEKER PROFILE
// ─────────────────────────────────────────────

/**
 * @desc    Create a new Job Seeker profile
 * @route   POST /api/profile/jobseeker
 * @access  Private (JWT required)
 *
 * req.user is set by authMiddleware from the verified JWT.
 * We use req.user._id to tie this profile to the authenticated user.
 */
const createJobSeekerProfile = async (req, res) => {
  try {
    // Prevent duplicate profiles
    const existing = await JobSeekerProfile.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists. Use PUT to update it.",
      });
    }

    const {
      fullName,
      phone,
      location,
      skills,
      experience,
      education,
      resumeURL,
      linkedin,
      github,
      portfolio,
    } = req.body;

    const profile = await JobSeekerProfile.create({
      userId: req.user._id,
      fullName,
      phone,
      location,
      skills: parseSkills(skills),
      experience,
      education,
      resumeURL: resumeURL || null,
      linkedin,
      github,
      portfolio,
    });

    res.status(201).json({
      success: true,
      message: "Job seeker profile created successfully.",
      profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error("createJobSeekerProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get the authenticated user's Job Seeker profile
 * @route   GET /api/profile/jobseeker
 * @access  Private
 */
const getJobSeekerProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({
      userId: req.user._id,
    }).populate("userId", "email role createdAt");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found.",
        profileExists: false,
      });
    }

    res.status(200).json({ success: true, profile, profileExists: true });
  } catch (error) {
    console.error("getJobSeekerProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Update the authenticated user's Job Seeker profile
 * @route   PUT /api/profile/jobseeker
 * @access  Private
 */
const updateJobSeekerProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      location,
      skills,
      experience,
      education,
      resumeURL,
      linkedin,
      github,
      portfolio,
    } = req.body;

    const updateData = {
      ...(fullName !== undefined && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(location !== undefined && { location }),
      ...(skills !== undefined && { skills: parseSkills(skills) }),
      ...(experience !== undefined && { experience }),
      ...(education !== undefined && { education }),
      ...(resumeURL !== undefined && { resumeURL }),
      ...(linkedin !== undefined && { linkedin }),
      ...(github !== undefined && { github }),
      ...(portfolio !== undefined && { portfolio }),
    };

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Create one first.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error("updateJobSeekerProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// EMPLOYER PROFILE
// ─────────────────────────────────────────────

/**
 * @desc    Create a new Employer profile
 * @route   POST /api/profile/employer
 * @access  Private
 */
const createEmployerProfile = async (req, res) => {
  try {
    const existing = await EmployerProfile.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Employer profile already exists. Use PUT to update it.",
      });
    }

    const {
      companyName,
      companyWebsite,
      companySize,
      industry,
      location,
      description,
      contactEmail,
      contactPhone,
    } = req.body;

    const profile = await EmployerProfile.create({
      userId: req.user._id,
      companyName,
      companyWebsite,
      companySize,
      industry,
      location,
      description,
      contactEmail,
      contactPhone,
    });

    res.status(201).json({
      success: true,
      message: "Employer profile created successfully.",
      profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error("createEmployerProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get the authenticated user's Employer profile
 * @route   GET /api/profile/employer
 * @access  Private
 */
const getEmployerProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({
      userId: req.user._id,
    }).populate("userId", "email role createdAt");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found.",
        profileExists: false,
      });
    }

    res.status(200).json({ success: true, profile, profileExists: true });
  } catch (error) {
    console.error("getEmployerProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Update the authenticated user's Employer profile
 * @route   PUT /api/profile/employer
 * @access  Private
 */
const updateEmployerProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyWebsite,
      companySize,
      industry,
      location,
      description,
      contactEmail,
      contactPhone,
    } = req.body;

    const updateData = {
      ...(companyName !== undefined && { companyName }),
      ...(companyWebsite !== undefined && { companyWebsite }),
      ...(companySize !== undefined && { companySize }),
      ...(industry !== undefined && { industry }),
      ...(location !== undefined && { location }),
      ...(description !== undefined && { description }),
      ...(contactEmail !== undefined && { contactEmail }),
      ...(contactPhone !== undefined && { contactPhone }),
    };

    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Create one first.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employer profile updated successfully.",
      profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error("updateEmployerProfile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// RESUME UPLOAD
// ─────────────────────────────────────────────

/**
 * @desc    Upload a resume file (PDF/DOC/DOCX) for a job seeker
 * @route   POST /api/profile/upload-resume
 * @access  Private
 *
 * How multer works here:
 * 1. The `upload.single("resume")` middleware in the route runs first.
 * 2. If the file passes the filter, multer writes it to `backend/uploads/`
 *    and sets `req.file` with metadata.
 * 3. This controller then reads `req.file.filename`, constructs a URL,
 *    saves it on the JobSeekerProfile, and returns it to the frontend.
 */
const uploadResume = async (req, res) => {
  try {
    // req.file is populated by multer's upload.single() middleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a PDF, DOC, or DOCX file.",
      });
    }

    // Build a URL the frontend can use to reference the file
    const resumeURL = `/uploads/${req.file.filename}`;

    // Delete the old resume file from disk if one exists
    const existingProfile = await JobSeekerProfile.findOne({
      userId: req.user._id,
    });
    if (existingProfile?.resumeURL) {
      const oldFilePath = path.join(
        __dirname,
        "..",
        existingProfile.resumeURL
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update or create the profile with the new resume URL
    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { resumeURL } },
      { new: true, upsert: false }
    );

    if (!profile) {
      // Clean up the uploaded file since there's no profile to attach it to
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message:
          "Job seeker profile not found. Please create your profile first before uploading a resume.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      resumeURL,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    // Clean up the file if something went wrong after upload
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("uploadResume Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// CHECK PROFILE EXISTS (utility for dashboard redirect)
// ─────────────────────────────────────────────

/**
 * @desc    Check whether the logged-in user has a profile yet
 * @route   GET /api/profile/check
 * @access  Private
 */
const checkProfileExists = async (req, res) => {
  try {
    const role = req.user.role;
    let profileExists = false;

    if (role === "jobseeker") {
      const profile = await JobSeekerProfile.findOne({ userId: req.user._id });
      profileExists = !!profile;
    } else if (role === "employer") {
      const profile = await EmployerProfile.findOne({ userId: req.user._id });
      profileExists = !!profile;
    }

    res.status(200).json({ success: true, profileExists, role });
  } catch (error) {
    console.error("checkProfileExists Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  createJobSeekerProfile,
  getJobSeekerProfile,
  updateJobSeekerProfile,
  createEmployerProfile,
  getEmployerProfile,
  updateEmployerProfile,
  uploadResume,
  checkProfileExists,
};