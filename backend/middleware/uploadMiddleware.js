import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type based on fieldname
function checkFileType(file, cb) {
  // Allow all file types for sampleMenuFile and governmentIdFile
  if (file.fieldname === "sampleMenuFile" || file.fieldname === "governmentIdFile") {
    return cb(null, true);
  }

  // For other fields like profilePic, allow only images
  const filetypes = /jpg|jpeg|png/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Only images (jpg, jpeg, png) are allowed for this field!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
