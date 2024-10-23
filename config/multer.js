// import multer from 'multer';
// import path from 'path';

// // Set storage for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');  // Directory where profile pictures are stored
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // e.g. profilePic-123456.png
//   }
// });

// // Multer upload setup
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
//   fileFilter: function (req, file, cb) {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only images are allowed'));
//     }
//   }
// });

// export default upload;





import multer from 'multer';
import path from 'path';

// Set storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Directory where files are stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // e.g. file-123456.png
  }
});

// Multer upload setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit to 10MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|csv|xlsx|xls|pdf|doc|docx/; // Add any additional file types here
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, CSV, Excel, and document files are allowed'));
    }
  }
});

export default upload;
