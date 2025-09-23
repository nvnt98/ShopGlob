// File: API/Routes/address.js
import express from "express";
import { Authenticated } from "../Middleware/auth.js";
import { addAddress, getUserAddress} from "../Controllers/address.js";


const router = express.Router();

// add address route
router.post('/add',Authenticated,addAddress);  //--/api/address/add

// get user address route
router.get('/get',Authenticated, getUserAddress);  //--/api/address/user



export default router;
