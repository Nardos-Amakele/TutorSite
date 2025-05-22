const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  mimeType: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const FileModel= mongoose.model("File",fileSchema)
module.exports={FileModel}