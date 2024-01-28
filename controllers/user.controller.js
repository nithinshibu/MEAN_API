import UserDetails from "../models/UserDetails.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserDetails.find({});
    return next(CreateSuccess(200, "All Users", users));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

export const getByID = async (req, res, next) => {
  try {
    const user = await UserDetails.findById(req.params.id);
    if (!user) {
      return next(CreateError(404, "User not found"));
    }
    return next(CreateSuccess(200, "Single User", user));
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};
