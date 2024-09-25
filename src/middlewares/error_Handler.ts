import { NextFunction, Request, Response } from "express-serve-static-core";
import AppError from "../utilities/app_errores";

function errorHandler(
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).send({
      message: err.message,
      errorCode: err.errorCode,
    });
    
    return;
  }
   
    res.status(500).send({
      message:`somthing is not going to work`
    });
  
}

export default errorHandler;
