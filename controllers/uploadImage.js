const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid4 } = require("uuid");

// 이미지 저장 경로 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/'; // 파일을 저장할 디렉토리
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid4()}${ext}`); // 파일 이름을 유니크하게 설정
  },
});

const upload = multer({ storage: storage }).single('file');

exports.uploadImage = (req, res) => {
  console.log('req', req);
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const file = req.file;
    const imageUrl = `${req.protocol}://${req.get('host')}/${file.path}`; // 이미지의 URL 생성

    res.status(201).json({ url: imageUrl });
  });
};
