import jwt from "jsonwebtoken"
import logger from "../logger/logger.js";

import User from "../models/user.model.js";


const protectRoute =async (req,res,next)=>{
    try {
       
        const token = req.header('Authorization');

        

        if(!token){
            logger.warn("protectRoute Unauthorized - No token")
           return res.status(401).json({error: "Unauthorized - No token Provider"}) 
        }
        
		const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            logger.warn("protectRoute Unauthorized - Invalid Token")
            return res.status(401).json({error: "Unauthorized - Invalid Token"}) 
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user
        next()
	} catch (error) {

        if(error instanceof jwt.TokenExpiredError){
            logger.warn("protectRoute Unauthorized - Expired Token")
            return res.status(401).json({error: "Unauthorized - Expired Token"}) 
        }
		
        logger.error(`protectRoute  [${error.message}]`);
		res.status(500).json({ error: "Internal server error" });
	}
}

export default protectRoute