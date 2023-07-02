const express = require("express");
const ctrl = require("../../controllers/contacts");
const router = express.Router();

const {validationBody, isValidId, authenticate} = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validationBody(schemas.addSchema), ctrl.add);

router.put("/:id",  authenticate,  isValidId,  validationBody(schemas.addSchema), ctrl.updateById);

router.patch("/:id/favorite",authenticate, isValidId, validationBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete("/:id",authenticate, isValidId, ctrl.deleteById);

module.exports = router;
