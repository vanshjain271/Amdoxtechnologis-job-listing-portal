const Application = require("../models/Application");
const Job = require("../models/Job");
const JobSeekerProfile = require("../models/JobSeekerProfile");
const Notification = require("../models/Notification");

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker only)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Check if user is a job seeker
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can apply for jobs.",
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || job.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Job listing not found or is no longer active.",
      });
    }

    // Get job seeker profile
    const seekerProfile = await JobSeekerProfile.findOne({
      userId: req.user._id,
    });
    if (!seekerProfile) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found. Please create one first.",
      });
    }

    // Check if profile has a resume
    if (!seekerProfile.resumeURL) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume to your profile before applying.",
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: seekerProfile._id,
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      jobId,
      applicantId: seekerProfile._id,
      resumeURL: seekerProfile.resumeURL,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Job listing not found." });
    }
    console.error("applyToJob Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applications for this job.",
      });
    }

    const applications = await Application.find({ jobId })
      .populate("applicantId", "fullName email phone location skills experience education resumeURL linkedin")
      .sort("-appliedAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("getJobApplications Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get applications by the authenticated job seeker
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
const getMyApplications = async (req, res) => {
  try {
    const seekerProfile = await JobSeekerProfile.findOne({
      userId: req.user._id,
    });
    if (!seekerProfile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    const applications = await Application.find({
      applicantId: seekerProfile._id,
    })
      .populate({
        path: "jobId",
        populate: { path: "employerId", select: "companyName location" },
      })
      .sort("-appliedAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("getMyApplications Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("applicantId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Verify job belongs to employer
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application.",
      });
    }

    application.status = status;
    await application.save();

    // ── Create Notification ──
    const applicantUserId = application.applicantId.userId;
    const notification = await Notification.create({
      userId: applicantUserId,
      type: "application_update",
      title: "Application Status Updated",
      message: `Your application for "${application.jobId.title}" has been ${status}.`,
      link: "/dashboard/applications",
      data: { applicationId: application._id, status },
    });

    // ── Emit Socket Event ──
    const io = req.app.get("io");
    if (io) {
      io.to(applicantUserId.toString()).emit("notification", notification);
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    console.error("updateApplicationStatus Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
};
