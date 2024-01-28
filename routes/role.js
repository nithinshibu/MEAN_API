import express from "express";
import {
  createRole,
  updateRole,
  getAllRoles,
  deleteRole,
} from "../controllers/role.controller.js";

const router = express.Router();

//Get all the roles from db
router.get("/getAllRoles", getAllRoles);

//Create new role in db
router.post("/create", createRole);

//Update new role in db

router.put("/update/:id", updateRole);

//Delete a role from DB

router.delete("/deleteRole/:id", deleteRole);

export default router;
