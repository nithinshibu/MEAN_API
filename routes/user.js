import express from "express";
import { getAllUsers, getByID } from "../controllers/user.controller.js";

const router = express.Router();

//get all users
router.get("/", getAllUsers);

//get based on id
router.get("/:id", getByID);

export default router;
