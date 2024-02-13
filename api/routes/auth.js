import express from "express";
import {
  register,
  login,
  registerAdmin,
  sendEmail,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

//Register User

router.post("/register", register);

//login

router.post("/login", login);

//register as admin

router.post("/register-admin", registerAdmin);

//send reset email

router.post("/send-email", sendEmail);

//reset the password

router.post("/reset-password", resetPassword);

export default router;
