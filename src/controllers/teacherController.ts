import { Request, Response } from "express";
import prisma from "../prisma/client";

export function addTeacher(req: Request, res: Response) {
    const { firstName, lastName, email, group } = req.body
}