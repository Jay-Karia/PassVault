const express = require("express")
const router = express.Router()

const {getPasswords, createPassword} = require("../controllers/passControllers")
const protect = require("../middlewares/protect")

router.post("/getPass", protect , getPasswords)
router.post("/create/password", protect , createPassword)

module.exports = router