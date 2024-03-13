import logger from "../logger/logger.js";
 const httpLogger = (req,res,next)=>{
    res.on("finish", function() {
        logger.info(`${req.method} ${decodeURI(req.url)} ${res.statusCode} ${res.statusMessage}`)
      });
    next();
}

export default httpLogger