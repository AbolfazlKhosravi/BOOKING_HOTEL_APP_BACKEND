import express from 'express';
import { getBookmarks,getBookmark } from '../controllers/bookmark-controller';
const router=express.Router();

router.get('/',getBookmarks)
router.get('/:id',getBookmark)

export default router;