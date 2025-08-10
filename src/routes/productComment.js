import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

/**
 * POST /products/:productId/comments
 *   Body: { content: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content는 필수입니다.' });

    const comment = await prisma.productComment.create({
      data: { content, productId }
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /products/:productId/comments/:id
 *   Body: { content: string }
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content는 필수입니다.' });

    const updated = await prisma.productComment.update({
      where: { id },
      data: { content }
    });
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    next(err);
  }
});

/**
 * DELETE /products/:productId/comments/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.productComment.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    next(err);
  }
});

/**
 * GET /products/:productId/comments
 * Query: limit (default 10), cursor (optional, lastCommentId)
 * Response: { comments: [{id, content, createdAt}], nextCursor }
 */
router.get('/', async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const limit  = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? { id: Number(req.query.cursor) } : undefined;

    const comments = await prisma.productComment.findMany({
      take:   limit,
      skip:   cursor ? 1 : 0,
      cursor,
      where:  { productId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true }
    });

    const nextCursor = comments.length
      ? comments[comments.length - 1].id
      : null;

    res.status(200).json({ comments, nextCursor });
  } catch (err) {
    next(err);
  }
});

export default router;
