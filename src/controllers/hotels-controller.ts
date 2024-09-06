import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";
import HotelsModules, { HotelType } from "../modules/hotels-module";

export const getHotels = tryCatchHandler<Request, Response>(
  async (req: Request, res: Response) => {
    console.log(req.body);

    const hotels: HotelType[] = await HotelsModules.getHotels();
    res.status(200).send(hotels);
  }
);
