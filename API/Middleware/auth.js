// File: API/Middleware/auth.js
import jwt from "jsonwebtoken"; 
import { User } from "../Models/User.js";


export const Authenticated = async (req, res, next) => {
  // 1. Get the authorization header from the request
  const token = req.header("Auth");
  if (!token) {
    return res.json({ message: "Login first" });
  }

  const decoded = jwt.verify(token,'baabu12-secret');
  const id = decoded.userId;
  // console.log(decoded);
  let user = await User.findById(id);

  if (!user) {
    return res.json({ message: "User not found" });
  }
  req.user = user;
  next();
  

};
