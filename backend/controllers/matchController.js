const Job = require("../models/Job");
const JobSeekerProfile = require("../models/JobSeekerProfile");

/**
 * @desc    Get recommended jobs based on seeker's skills
 * @route   GET /api/jobs/recommended
 * @access  Private (Job Seeker only)
 */
const getRecommendedJobs = async (req, res) => {
  try {
    // 1. Get current seeker's profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found. Please create a profile first to get recommendations.",
      });
    }

    const seekerSkills = profile.skills.map(s => s.toLowerCase());

    if (seekerSkills.length === 0) {
      return res.status(200).json({
        success: true,
        jobs: [],
        message: "Add skills to your profile to see recommended jobs!",
      });
    }

    // 2. Get all active jobs (excluding those already applied to might be better, but let's keep it simple first)
    const jobs = await Job.find({ status: "active" }).populate(
      "employerId",
      "companyName location industry"
    );

    // 3. Calculate match score for each job
    const recommendedJobs = jobs
      .map((job) => {
        const jobSkills = job.skills.map(s => s.toLowerCase());
        
        if (jobSkills.length === 0) return { ...job._doc, matchScore: 0 };

        // Find intersection
        const matchingSkills = jobSkills.filter((skill) =>
          seekerSkills.includes(skill)
        );

        // Simple scoring algorithm: (matched skills / total job skills) * 100
        const matchScore = Math.round((matchingSkills.length / jobSkills.length) * 100);

        return {
          ...job._doc,
          matchScore,
          matchedSkills: matchingSkills,
        };
      })
      .filter((job) => job.matchScore > 10) // Only show jobs with > 10% match
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by highest score first
      .slice(0, 10); // Top 10 recommendations

    res.status(200).json({
      success: true,
      count: recommendedJobs.length,
      jobs: recommendedJobs,
    });
  } catch (error) {
    console.error("getRecommendedJobs Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getRecommendedJobs };
