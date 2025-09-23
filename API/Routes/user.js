// File: API/Routes/user.js
import express from "express";
import { login, register,getAllUsers, getProfile } from "../Controllers/user.js";

import { Authenticated } from "../Middleware/auth.js";

const router = express.Router();


// register user route
router.post('/register',register);  //--/api/user/register

// login user route
router.post('/login',login);  //--/api/user/login

// get all users route
router.get('/all', getAllUsers);  //--/api/user/all


// get user profile route
router.get('/profile', Authenticated, getProfile);  //--/api/user/profile





export default router;
