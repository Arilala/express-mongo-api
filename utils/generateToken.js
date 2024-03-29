import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
