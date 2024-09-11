import tryCatchHandler from "../utilities/tryCatch_handler";
import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import HotelsModules, { HotelType } from "../modules/hotels-module";

export interface QueryType {
  destination?: string;
  options?: {
    count?: string;
    title?: "Adult" | "Children" | "Room";
    minLimit?: string;
  }[];
  date?: {
    startDate?: string ;
    endDate?: string ;
    key?: string;
  };
}

export const getHotels = tryCatchHandler<
  Request<ParamsDictionary, {}, {}, QueryType>,
  Response<HotelType[]>
>(
  async (
    req: Request<ParamsDictionary, {}, {}, QueryType>,
    res: Response<HotelType[]>
  ) => {
    const query: QueryType = req.query;

    const hotels: HotelType[] = await HotelsModules.getHotels(query);
    res.status(200).json(hotels);
  }
);
