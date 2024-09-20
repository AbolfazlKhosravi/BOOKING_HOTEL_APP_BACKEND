interface AppErrorType {
  statusCode: number;
  errorCode: number;
}

class AppError extends Error implements AppErrorType {
  statusCode: number;
  errorCode: number;

  constructor(errorCode: number, statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export default AppError;
