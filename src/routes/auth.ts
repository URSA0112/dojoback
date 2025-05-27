//login (check user role)
import { Router } from "express";
import { checkUser, createUser, getAllUsers, instantCreateUser } from "../controllers/userController";


const router = Router();

//login (check user role)
router.post("/register", createUser);
router.post("/login", checkUser);
router.get("/users", getAllUsers)
router.post("/testUser", instantCreateUser)

export default router;