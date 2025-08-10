import express from 'express';
import { PrismaClient } from '@prisma/client';
import { deserializeJsonResponse } from '@prisma/client/runtime/library';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req ,res, next) => {
     try {
        const { name, description, price, tags } = req.body;

        //필수 필드 검증
        if (!name || typeof price !== 'number' || !Array.isArray(tags)) {
            return res
                .status(400).json({ error : 'name, price, tags는 필수입니다.'});
        }

        const newProdcut = await prisma.product.create({
            dtat: {
                name, 
                description,
                price,
                tags,
            },
        });

        return res.status(201).json(newProdcut);
     } catch (err) {
        next(err);
     }
});


router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error : '유효한 상품 ID를 숫자로 전달해주세요.'});
        }

        const product = await prisma.product.finUnique({
            where: { id } ,
            select: {
                id: true,
                name: true, 
                description: true, 
                price: true,
                tags: true, 
                createdAt: true,
            },
        });

        if (!product) {
            return res.status(404).json({ error: '해당 ID의 상품을 찾을 수 없습니다.'});
        }

        res.status(200).json(product);
    } catch(err) {
        next(err);
    }
});


router.patch('/:id', async (req, res, nest) => {
    try {
        const id = Number(req.parmas.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({error : '유효한 상품 ID를 숫자로 전달해주세요. '})
        }

        const { name, description, price, tags } = req.body;
        if (name === undefinded && description === undefined && price === undefined && tags === undefined) {
            return res. statusMessage(400).json({ error : '수정할 필드를 하나 이상 포함하세욧!'});
        }

        const data = {};
        if (name !== undefined)        data.name = name;
        if (description !== undefined) data.description = description;
        if (price !== undefined) {
            if (typeof price !== 'number') {
                return res.status(400).json({ error: 'price는 숫자여야 합니다.' });
            }
            data.price = price;
        }
        
        if (tags !== undefined) {
            if (!Array.isArray(tags)) {
                return res.status(400).json({ error: 'tags는 문자열 배열이어야 합니다.' });
            }
            data.tags = tags;
        }

        const updated = await prisma.product.update({
        where: { id },
        data,
        });

        res.status(200).json(updated);
        }

    catch (err) {
        // 없는 ID로 update 시도하면 Prisma 오류 → 404로 변환
        if (err.code === 'P2025') {
        return res.status(404).json({ error: '해당 ID의 상품을 찾을 수 없습니다.' });
        }
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '유효한 상품 ID를 숫자로 전달해주세요.' });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (err) {
    // 없는 ID로 delete 시도하면 Prisma 오류 → 404로 변환
    if (err.code === 'P2025') {
      return res.status(404).json({ error: '해당 ID의 상품을 찾을 수 없습니다.' });
    }
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    // 1) 페이징 파라미터
    const offset = parseInt(req.query.offset) || 0;
    const limit  = parseInt(req.query.limit)  || 10;

    // 2) 정렬 조건
    const orderBy = req.query.sort === 'recent'
      ? { createdAt: 'desc' }
      : { id: 'asc' };  // 기본은 id 오름차순

    // 3) 검색 조건
    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { name:        { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }
      : {};

    // 4) 조회
    const products = await prisma.product.findMany({
      skip:   offset,
      take:   limit,
      where,
      orderBy,
      select: {
        id:        true,
        name:      true,
        price:     true,
        createdAt: true,
      },
    });

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/views', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: '유효한 상품 ID를 숫자로 전달해주세요.' });

    const updated = await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true }
    });

    res.status(200).json(updated); // { id, views }
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: '해당 ID의 상품을 찾을 수 없습니다.' });
    next(err);
  }
});

export default router;

//GET http://localhost:3000/products/1