const express = require("express");
const ctrl = require("../../controllers/contacts");
const router = express.Router();

const { validationBody } = require("../../middlewares");
const schemas = require("../../schemas");

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", validationBody(schemas.addSchema), ctrl.add);

router.delete("/:contactId", validationBody(schemas.addSchema), ctrl.deleteById
);

router.put("/:contactId", ctrl.updateById);

module.exports = router;
