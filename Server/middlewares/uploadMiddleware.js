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
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  }
});


const checkRole = async (req, res, next) => {
  if (req.params.role === 'teacher') {

    upload.array('attachments', 10)(req, res, function (err) {
      if (err) {
        return res.status(400).send({ msg: err.message });
      }
      next(); // continue to the controller
    });
  } else {
    next(); // no need for file upload
  }
}


module.exports = {
  checkRole,
}; 
