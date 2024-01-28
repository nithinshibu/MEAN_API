import express from "express";
import { getAllUsers, getByID } from "../controllers/user.controller.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//get all users
router.get("/", verifyAdmin, getAllUsers);

//get based on id
router.get("/:id", verifyUser, getByID);

export default router;
