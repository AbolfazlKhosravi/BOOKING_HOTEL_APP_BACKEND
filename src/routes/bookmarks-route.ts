import express from 'express';
import { getBookmarks } from '../controllers/bookmark-controller';
const router=express.Router();

router.get('/',getBookmarks)
// router.get('/:id',getHotel)

export default router;