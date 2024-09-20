import { NextFunction } from "express-serve-static-core";
export default function tryCatchHandler<Req, Res>(
  controller: (reg: Req, res: Res) => Promise<void>
) {
  return async (req: Req, res: Res, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error:unknown) {
      next(error);
    }
  };
}
