import express from "express";
import {
  register,
  login,
  registerAdmin,
} from "../controllers/auth.controller.js";

const router = express.Router();

//Register User

router.post("/register", register);

//login

router.post("/login", login);

//register as admin

router.post("/register-admin", registerAdmin);

export default router;
