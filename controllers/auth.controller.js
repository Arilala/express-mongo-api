import logger from "../logger/logger.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import {generateTokenAndSetCookie} from "../utils/generateToken.js";
import {isValidEmail} from "../utils/validations.js"

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password,email } = req.body;

    const user = await User.findOne({ userName });

    if (user) {
      logger.warn(` User ${userName}  already exists`);
      return res.status(400).json({ error: "UserName already exists" });
    }


    if(!isValidEmail(email)){
      logger.warn(` User ${email}  Invalid`);
      return res.status(400).json({ error:"Invalid user email" });
    }

    const userEmail = await User.findOne({ email });


    if (userEmail) {
      logger.warn(` User ${email}  already exists`);
      return res.status(400).json({ error: "User email already exists" });
    }

    const newUser = new User({
      fullName,
      userName,
      password,
      email
    });

   

    if (newUser) {
       
      newUser.save();
      logger.info(
        ` User ${userName} signup at  ${dayjs(newUser.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        )}`
      );
      return res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email:newUser.email
      });
    } else {
        return res.status(400).json({ error:"Invalid user data" });
    }

    
  } catch (error) {
    logger.error(`Signup Route [${error.message}]`);
    res.status(500).json({ error: "internal server error" });
  }
};

export const login =async (req, res) => {
  try {
    const {userName,password,email} = req.body;



    let user= await User.findOne({userName})
    if(!user){
      user = await User.findOne({email})
    }
    
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")

    if(!user || !isPasswordCorrect){
      logger.warn(`Invalid login ${userName} ${password}`);
      return res.status(400).json({ error: "Invalid username or password" });
    }


    return res.status(200).json({
      id:user._id,
      fullName:user.fullName,
      userName:user.userName,
      email:user.email,
      token:generateTokenAndSetCookie(user._id)
    })

    
  } catch (error) {
   // logger.error(`Login Route [${error.message},${error.stack}]`);
   logger.error(`Login Route [${error.message}]`);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    
    res.cookie("jwt","",{maxAge:0})
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Login Route [${error.message},${error.stack}]`);
    res.status(500).json({ error: "internal server error" });
  }
};
