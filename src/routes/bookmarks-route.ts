import express from 'express';
import { getBookmarks,getBookmark ,addBookmark} from '../controllers/bookmark-controller';
const router=express.Router();

router.get('/',getBookmarks)
router.get('/:id',getBookmark)
router.post('/addbookmark',addBookmark)

export default router;