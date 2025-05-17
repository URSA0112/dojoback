"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTeacher = addTeacher;
const client_1 = __importDefault(require("../prisma/client"));
function addTeacher(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, phoneNumber, subject, grade, group } = req.body;
        try {
            const teacher = yield client_1.default.teacher.create({
                data: Object.assign(Object.assign({ firstName,
                    lastName,
                    email,
                    phoneNumber,
                    subject }, (grade && { grade })), (group && { group })),
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
    });
}
