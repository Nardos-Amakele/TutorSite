const multer = require('multer');
const path = require('path');

// Set storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  // Accept only certain types
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  }
});

const checkRole = (req, res, next) => {
  if (req.params.role === 'teacher') {
    // Validate required fields for teacher registration
    const { availability, subjects, hourlyRate } = req.body;
    if (!availability || !subjects || !hourlyRate) {
      return res.status(400).send({ 
        msg: "Teacher registration requires availability, subjects, and hourlyRate" 
      });
    }

    upload.array('attachments', 10)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({ msg: 'File size too large. Maximum size is 10MB' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).send({ msg: 'Too many files. Maximum is 10 files' });
        }
        return res.status(400).send({ msg: err.message });
      } else if (err) {
        return res.status(400).send({ msg: err.message });
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = {
  checkRole,
}; 
