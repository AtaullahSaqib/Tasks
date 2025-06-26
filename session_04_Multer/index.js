const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 5000

app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

function fileFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only jpeg, jpg, and png files are allowed'), false);
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: fileFilter
})

app.get('/', (req, res) => {
  res.render('upload', { message: null, error: null });
});

app.post('/upload', (req, res, next) => {
  upload.array('images', 5)(req, res, function (err) {
    if (err) return next(err);

    res.render('upload', {
      message: `${req.files.length} file(s) uploaded successfully`,
      error: null
    });
  });
});

app.use((err, req, res, next) => {
  res.status(400).json({
    error: err.message
  });
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
