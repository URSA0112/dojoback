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
exports.checkUser = void 0;
const client_1 = __importDefault(require("../prisma/client"));
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
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client_1.default.user.findFirst({
            where: { email, password },
        });
        if (user && user.role === "teacher") {
            res.status(200).json({ message: "teacher" });
        }
        else if (user && user.role === "student") {
            res.status(200).json({ message: "student" });
        }
        else if (user && user.role === "parent") {
            res.status(200).json({ message: "parent" });
        }
        else if (user && user.role === "admin") {
            res.status(200).json({ message: "admin" });
        }
        else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Failed to check user" });
    }
});
exports.checkUser = checkUser;
