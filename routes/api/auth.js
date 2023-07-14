const express = require("express")
const {validationBody, authenticate, isValidId, upload} = require("../../middlewares")
const {schemas} = require("../../models/user")
const ctrl = require("../../controllers/auth")

const router = express.Router()

// signup
router.post("/register", validationBody(schemas.registerSchema), ctrl.register)

router.get("/verify/:verificationToken", ctrl.verifyEmail);

// для повторної відправки листа верефікації
router.post("/verify", validationBody(schemas.emailSchema), ctrl.resendVerifyEmail);

// signin
router.post("/login", validationBody(schemas.loginSchema), ctrl.login)

router.get("/current", authenticate, ctrl.getCurrent)

router.post("/logout", authenticate, ctrl.logout)

router.patch("/:id/subscription", authenticate, isValidId,  validationBody(schemas.subscriptionSchema), ctrl.updateSubscription);


router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router