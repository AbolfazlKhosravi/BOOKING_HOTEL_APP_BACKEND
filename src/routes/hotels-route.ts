import express from 'express';
import { getHotels } from '../controllers/hotels-controller';
const router=express.Router();

router.get('/',getHotels)


export default router;
