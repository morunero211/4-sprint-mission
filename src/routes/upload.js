import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// __dirname 대체 (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 업로드 디렉토리 (환경변수로 덮어쓰기 가능: UPLOAD_DIR=/data/uploads)
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads');

// 디렉토리 없으면 생성
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// 파일 이름 안전하게 만들기
function safeFilename(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const base = path.basename(originalname, ext)
    .replace(/[^\w\-]+/g, '_')   // 영숫자/밑줄/하이픈만
    .slice(0, 60);               // 너무 길면 컷
  return `${Date.now()}_${base}${ext}`;
}

// Multer 설정 (디스크 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
});

// 이미지 파일만 통과
const fileFilter = (req, file, cb) => {
  const allowed = /\.(jpe?g|png|gif|webp|avif)$/i;
  if (!allowed.test(file.originalname)) {
    return cb(new Error('이미지 파일만 업로드할 수 있습니다(jpg, png, gif, webp, avif).'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * POST /upload/image
 * Form-Data: image (file)
 * Response: { path: "/uploads/xxx.png", size, mimetype }
 */
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'image 파일이 필요합니다.' });
  }
  // 정적 경로로 접근할 수 있는 URL Path 반환
  const publicPath = `/uploads/${req.file.filename}`;
  return res.status(201).json({
    path: publicPath,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

export default router;