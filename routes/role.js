import express from "express";
import {
  createRole,
  updateRole,
  getAllRoles,
  deleteRole,
} from "../controllers/role.controller.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//Get all the roles from db
router.get("/getAllRoles", getAllRoles);

//Create new role in db
router.post("/create", verifyAdmin, createRole);

//Update new role in db

router.put("/update/:id", verifyAdmin, updateRole);

//Delete a role from DB

router.delete("/deleteRole/:id", verifyAdmin, deleteRole);

export default router;
