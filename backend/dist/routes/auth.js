"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_js_1 = require("../controllers/auth.js");
const auth_js_2 = require("../middleware/auth.js");
const router = express_1.default.Router();
router.post('/register', auth_js_1.register);
router.post('/login', auth_js_1.login);
router.post('/logout', auth_js_1.logout);
router.post('/refresh-token', auth_js_1.refreshToken);
router.post('/forgot-password', auth_js_1.forgotPassword);
router.post('/reset-password', auth_js_1.resetPassword);
router.get('/verify-email/:token', auth_js_1.verifyEmail);
router.post('/resend-verification', auth_js_1.resendVerification);
router.get('/me', auth_js_2.protect, (req, res) => {
    res.json({
        success: true,
        data: {
            user: req.user
        }
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map