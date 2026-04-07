const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

/**
 * @desc    Get analytics for employer
 * @route   GET /api/analytics/employer
 * @access  Private (Employer only)
 */
const getEmployerAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const totalJobs = jobs.length;
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    // Aggregate applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Aggregate job postings over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const jobsOverTime = await Job.aggregate([
      { $match: { postedBy: req.user._id, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        applicationsByStatus,
        jobsOverTime
      }
    });
  } catch (error) {
    console.error("getEmployerAnalytics Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get analytics for job seeker
 * @route   GET /api/analytics/seeker
 * @access  Private (Job Seeker only)
 */
const getSeekerAnalytics = async (req, res) => {
  try {
    // This requires the JobSeekerProfile _id, but we have req.user._id
    const JobSeekerProfile = require("../models/JobSeekerProfile");
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    const totalApplications = await Application.countDocuments({ applicantId: profile._id });
    
    const applicationsByStatus = await Application.aggregate([
      { $match: { applicantId: profile._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        applicationsByStatus
      }
    });
  } catch (error) {
    console.error("getSeekerAnalytics Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getEmployerAnalytics, getSeekerAnalytics };
