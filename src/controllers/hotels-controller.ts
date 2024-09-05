import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";

export const getHotels = tryCatchHandler<Request, Response>(
  async (req: Request, res: Response) => {
    console.log(req);

    res.status(200).send("hotels");
  }
);
