import express from 'express';
import { getHotels ,getHotel } from '../controllers/hotels-controller';
const router=express.Router();

router.get('/',getHotels)
router.get('/:id',getHotel)

export default router;
