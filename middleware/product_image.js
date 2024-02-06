const multer = require("multer");
const path = require("path");
const hash = require("random-hash");
const { v4: uuidv4 } = require("uuid");

// Define storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/productImage/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueFilename = uuidv4(); // Generate a unique filename using UUID
    const fileExtension = path.extname(file.originalname); // Get the original file extension
    const filename = `${uniqueFilename}${fileExtension}`; // Combine unique filename and original extension
    cb(null, filename);
  },
});

// console.log("file data multer ===>>>", storage);

// Create a multer instance with the defined storage settings
const upload = multer({ storage });

// Export the multer instance for use in your routes or middleware
module.exports = upload;
