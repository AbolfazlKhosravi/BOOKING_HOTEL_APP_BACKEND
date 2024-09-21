import express from 'express';
import { getBookmarks,getBookmark ,addBookmark,deleteBookmark} from '../controllers/bookmark-controller';
const router=express.Router();

router.get('/',getBookmarks)
router.get('/:id',getBookmark)
router.post('/addbookmark',addBookmark)
router.delete('/:id',deleteBookmark)
export default router;