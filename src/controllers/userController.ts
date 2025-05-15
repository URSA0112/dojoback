import { Request, Response } from "express";
import prisma from "../prisma/client";


// 📌 CREATE User
// export const createUser = async (req: Request, res: Response) => {
//     try {
//         const { name, email, password, role } = req.body;
        
//         const user = await prisma.user.create({
//             data: { name, email, password, role },
//         });
//         res.status(201).json(user);
//     } catch (err) {
//         res.status(500).json({ error: "Failed to create userrrr" });
//     }
// };

export const checkUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
            where: { email, password },
        });
        if (user && user.role === "teacher") {
            res.status(200).json({ message: "teacher" });
        } else if (user && user.role === "student") {
            res.status(200).json({ message: "student" });
        } else if (user && user.role === "parent") {                             
            res.status(200).json({ message: "parent" });
        }  else if (user && user.role === "admin") {                             
            res.status(200).json({ message: "admin" });
        } 
         else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to check user" });
    }
}