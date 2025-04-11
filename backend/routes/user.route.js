import express from "express";
import { login, logout, register, updateProfile, addBookmark, removeBookmark} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

router.route("/bookmark/:id")
  .post(isAuthenticated, addBookmark)  
  .delete(isAuthenticated, removeBookmark);
export default router;

