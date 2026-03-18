const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Multer handles multipart/form-data (file uploads).
 *
 * How it works:
 * 1. Client sends a POST request with enctype="multipart/form-data"
 * 2. Multer intercepts, validates the file type and size,
 *    then writes the file to disk at `backend/uploads/`
 * 3. It attaches a `req.file` object with { filename, path, size, mimetype }
 * 4. The controller then reads `req.file.filename` and saves it to the DB
 */

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- Disk storage config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Format: resume-<userId>-<timestamp>.<ext>
    // Using userId ensures each user's resume is uniquely named
    // and can be overwritten on re-upload
    const userId = req.user?._id || "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `resume-${userId}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// --- File type filter ---
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Only PDF, DOC, and DOCX files are allowed for resume upload."),
      false
    );
  }
};

// --- Multer instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

module.exports = upload;