import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 라우터들
import productRouter from './routes/product.js';
import articleRouter from './routes/article.js';
import productCommentRouter from './routes/productComment.js';
import articleCommentRouter from './routes/articleComment.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();


const ALLOW_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: ALLOW_ORIGIN, credentials: true }));

// Body 파서
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// 헬스체크
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }));


// 라우터 마운트 (모듈 분리)
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/products/:productId/comments', productCommentRouter);
app.use('/articles/:articleId/comments', articleCommentRouter);
app.use('/upload', uploadRouter);

// 라우트 중복 제거(app.route 예시)

app.route('/users')
  .get((req, res) => res.status(200).json([]))
  .post((req, res) => {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'name, email은 필수입니다.' });
    return res.status(201).json({ id: 1, name, email });
  });


app.use((req, res) => {
  res.status(404).json({ error: '리소스를 찾을 수 없습니다.' });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);

  // Multer 에러 처리
  if (err.name === 'MulterError' || /File too large/i.test(err.message)) {
    return res.status(400).json({ error: err.message });
  }
  if (/이미지 파일만 업로드할 수 있습니다/i.test(err.message)) {
    return res.status(400).json({ error: err.message });
  }

  // Prisma 에러 매핑 (상황에 맞게 확장)
  if (err.code === 'P2002') return res.status(409).json({ error: '중복된 데이터입니다.' });
  if (err.code === 'P2025') return res.status(404).json({ error: '대상을 찾을 수 없습니다.' });

  if (err.status && typeof err.status === 'number') {
    return res.status(err.status).json({ error: err.message || '에러가 발생했습니다.' });
  }

  return res.status(500).json({ error: '서버 에러가 발생했습니다.' });
});

// ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행: http://localhost:${PORT}`));
