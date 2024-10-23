import express from "express";
import { createUserType, deleteUserType, getAllUserTypes, updateUserType } from "../controllers/usertype.js";





const router = express.Router();

router.post("/usertype/create", createUserType);           
router.put("/usertype/:id", updateUserType);        
router.delete("/usertype/:id", deleteUserType); 
router.get("/admin/usertypes/getall", getAllUserTypes);





export default router;
