import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";
import HotelsModules, { HotelType } from "../modules/hotels-module";

export const getHotels = tryCatchHandler<Request, Response<HotelType[]>>(
  async (req: Request, res: Response<HotelType[]>) => {
    console.log(req.query.options);

    const hotels: HotelType[] = await HotelsModules.getHotels();
    res.status(200).json(hotels);
  }
);
