import { createLogger, transports, format } from "winston";
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(label({ label: "logger " }), timestamp(), prettyPrint()),
  transports: [
    new transports.Console({ level: "info" }),
    new transports.File({
      level: "debug",
      filename: "queryLog.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});
export default logger;
