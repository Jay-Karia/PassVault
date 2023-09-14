const express = require("express")
const router = express.Router()

const {allPasswords, createPassword, getPassword} = require("../controllers/passControllers")
const protect = require("../middlewares/protect")

router.post("/getPass", protect , allPasswords)
router.post("/create/password", protect , createPassword)
router.post("/get/password/:id", protect, getPassword)

module.exports = router