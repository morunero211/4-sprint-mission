import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /articles
 * Body: { title: string, content: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title과 content는 필수입니다.' });
    }
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /articles/:id
 * Path:   id
 * Response: { id, title, content, createdAt }
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '유효한 ID를 전달해주세요.' });
    }
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /articles/:id
 * Body: { title?: string, content?: string }
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: '유효한 ID를 전달해주세요.' });

    const { title, content } = req.body;
    if (title === undefined && content === undefined) {
      return res.status(400).json({ error: '수정할 필드를 하나 이상 보내주세요.' });
    }

    const data = {};
    if (title    !== undefined) data.title   = title;
    if (content  !== undefined) data.content = content;

    const updated = await prisma.article.update({
      where: { id },
      data,
    });
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    next(err);
  }
});

/**
 * DELETE /articles/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: '유효한 ID를 전달해주세요.' });

    await prisma.article.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    next(err);
  }
});

/**
 * GET /articles
 * Query:
 *   - offset: number (default 0)
 *   - limit:  number (default 10)
 *   - sort:   'recent' (optional)
 *   - search: string (optional)
 * Response: [{ id, title, content, createdAt }, ...]
 */
router.get('/', async (req, res, next) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit  = parseInt(req.query.limit)  || 10;
    const orderBy = req.query.sort === 'recent'
      ? { createdAt: 'desc' }
      : { id: 'asc' };

    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { title:   { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ]
        }
      : {};

    const list = await prisma.article.findMany({
      skip:   offset,
      take:   limit,
      where,
      orderBy,
      select: {
        id:        true,
        title:     true,
        content:   true,
        createdAt: true,
      },
    });

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/views', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: '유효한 게시글 ID를 숫자로 전달해주세요.' });

    const updated = await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true }
    });

    res.status(200).json(updated); // { id, views }
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: '해당 ID의 게시글을 찾을 수 없습니다.' });
    next(err);
  }
});

export default router;
