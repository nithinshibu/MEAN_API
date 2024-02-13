import Role from "../models/Role.js";
import User from "../models/UserDetails.js";
import bcrypt from "bcryptjs";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
  try {
    const role = await Role.find({ role: "User" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.userName,
      email: req.body.email,
      password: hashPassword,
      roles: role,
    });

    await newUser.save();
    return next(CreateSuccess(200, "User Registered Successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const role = await Role.find({});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      roles: role,
      isAdmin: true,
    });

    await newUser.save();
    return next(CreateSuccess(200, "Admin Registered Successfully"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );
    const { roles } = user;
    if (!user) {
      return next(CreateError(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(CreateError(400, "Password is incorrect"));
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        roles: roles,
      },
      process.env.JWT_SECRET
    );
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: 200,
      message: "Login Success",
      data: user,
    });
    //return next(CreateSuccess(200, "Login Success"));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    return next(CreateError(404, "User not found to reset the email"));
  }
  const payload = {
    email: user.email,
  };
  const expiryTime = 300;

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiryTime,
  });

  const newToken = new UserToken({
    userId: user._id,
    token: token,
  });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abc@gmail.com",
      pass: "abc xvyx cvbner abc xyz",
    },
  });

  let mailDetails = {
    from: "xyz@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `
  <html>
<head>
  <title>Password reset request</title>
</head>
<body>
  <h1>Password Reset</h1>
  <p>Dear ${user.username}</p>
  <p>We have received a request to reset your password</p>
  <a href=${process.env.LIVE_URL}/reset/${token}><button>Reset Password</button></a>
  <p>Please note that this link is valid for 5 mins, If you didn't request a password reset, Please discard this message</p>
  <p>Thank you,</p>
  <p>Zash zeeshan</p>
</body>
</html>`,
  };

  mailTranspoter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.log(err);
      return next(createError(500, "Something went wrong"));
    } else {
      await newToken.save();
      return next(createSuccess(200, "Email sent successfully!"));
    }
  });
};

export const resetPassword = (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return next(createError(500, "Link Expired!!"));
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10);
      const encryptPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptPassword;
      try {
        const updateduser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );
        return next(createSuccess(200, "Password Reset success"));
      } catch (error) {
        return next(createError(500, "Something went wrong!"));
      }
    }
  });
};
