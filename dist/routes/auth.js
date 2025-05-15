"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//login (check user role)
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post("/login", userController_1.checkUser);
exports.default = router;
