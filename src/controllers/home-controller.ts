import HomeModules,{ HomeDataType }  from "../modules/home-module";
import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";

export const getHomeData = tryCatchHandler<Request, Response<HomeDataType>>(
  async (req: Request, res: Response<HomeDataType>) => {
    console.log(req.body);

    const dataHome: HomeDataType = await HomeModules.getHomeData();
    res.status(200).json(dataHome);
  }
);
