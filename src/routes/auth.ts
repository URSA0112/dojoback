//login (check user role)
import { Router } from "express";
import { checkUser } from "../controllers/userController";

const router = Router();

router.post("/login", checkUser);


export default router;