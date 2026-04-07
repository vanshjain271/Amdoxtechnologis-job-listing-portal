const Job = require("../models/Job");
const EmployerProfile = require("../models/EmployerProfile");

// @desc    Create a new job listing
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      qualifications,
      responsibilities,
      location,
      salaryRange,
      jobType,
      experience,
      skills,
    } = req.body;

    // Check if user is an employer
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can create job listings.",
      });
    }

    // Get employer profile to link
    const employerProfile = await EmployerProfile.findOne({
      userId: req.user._id,
    });
    if (!employerProfile) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found. Please create one first.",
      });
    }

    const job = await Job.create({
      title,
      description,
      qualifications,
      responsibilities,
      location,
      salaryRange,
      jobType,
      experience,
      skills,
      employerId: employerProfile._id,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job listing created successfully!",
      job,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error("createJob Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get all jobs (with search and filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, salaryRange } = req.query;

    const query = { status: "active" };

    // Search by keyword (title, description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { skills: { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .populate("employerId", "companyName companyWebsite industry location")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("getJobs Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "companyName companyWebsite industry location description"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job listing not found.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("getJobById Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Job listing not found." });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job listing not found.",
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing.",
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Job listing updated successfully!",
      job,
    });
  } catch (error) {
    console.error("updateJob Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Delete job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job listing not found.",
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing.",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job listing deleted successfully!",
    });
  } catch (error) {
    console.error("deleteJob Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc    Get jobs posted by the authenticated employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("getMyJobs Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};
