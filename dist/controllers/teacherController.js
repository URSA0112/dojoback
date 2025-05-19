"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTeacher = addTeacher;
const client_1 = __importDefault(require("../prisma/client"));
async function addTeacher(req, res) {
    const { firstName, lastName, email, phoneNumber, subject, grade, group } = req.body;
    try {
        const teacher = await client_1.default.teacher.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                subject,
                ...(grade && { gradeRef: { connect: { id: grade } } }),
                ...(group && { groupRef: { connect: { id: group } } }),
                user: {
                    create: {
                        email,
                        password: "teacher1234",
                        role: "teacher",
                    },
                },
            }
        });
        res.status(201).json({
            success: true,
            message: "✅Teacher added successfully",
            data: teacher
        });
    }
    catch (error) {
        console.error("Add teacher error:", error);
        res.status(500).json({ error: "Failed to add teacher", err: error.message });
    }
}
//# sourceMappingURL=teacherController.js.map