const path = require("path");

/**
 * Simulated AI Resume Parser
 * In a real production app, this would use an LLM (e.g. Gemini, OpenAI) 
 * or a specialized parsing API (e.g. Sovren, Affinda).
 * For this project, we simulate high-accuracy extraction.
 */
const parseResume = async (filename) => {
  console.log(`Parsing resume: ${filename}...`);

  // Simulate network delay for "AI processing"
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock extracted data
  // In reality, we'd read the file content and pass it to an LLM.
  return {
    fullName: "Vansh Jain", // Example mock data
    skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JavaScript", "REST AIPs"],
    experience: "Software Engineer Intern with experience in full-stack development. Worked on building scalable web applications using the MERN stack.",
    education: "Bachelor of Technology in Computer Science",
    phone: "+91 9876543210",
    location: "New Delhi, India",
    linkedin: "https://linkedin.com/in/vanshjain",
    github: "https://github.com/vanshjain",
  };
};

module.exports = { parseResume };
