import {createLogger, format, transports} from "winston";

import winston from "winston";
import dayjs from "dayjs";
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };

 
   
 const logger = createLogger({
    levels: logLevels,
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({level,message,timestamp})=>{
            return ` ${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss') } |  ${level.toUpperCase()} | ${message}`
        })
    ),
    transports: [new transports.Console(),new winston.transports.File({ filename: 'logs/application.log' }), ],
  });
  export default logger;