const express = require("express")
const {validationBody, authenticate, isValidId, upload} = require("../../middlewares")
const {schemas} = require("../../models/user")
const ctrl = require("../../controllers/auth")

const router = express.Router()

// signup
router.post("/register", validationBody(schemas.registerSchema), ctrl.register)

// signin
router.post("/login", validationBody(schemas.loginSchema), ctrl.login)

router.get("/current", authenticate, ctrl.getCurrent)

// router.post("/avatars", authenticate, ctrl.logout)

router.patch("/:id/subscription", authenticate, isValidId,  validationBody(schemas.subscriptionSchema), ctrl.updateSubscription);


// для зміни аватара. поле Avatar
// upload.fields([{name:"cover", maxCount:1},{name:"subcover",1}]) масив обєктів
// upload.array("avatar", 8)
router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)
// router.patch("/avatars",  upload.single("avatar"), async(req, res) =>{
//    console.log('req.body', req.body)
//    console.log('req.body', req.file)
// })
module.exports = router