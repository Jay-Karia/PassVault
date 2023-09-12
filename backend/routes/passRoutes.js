const express = require("express")
const router = express.Router()

const {allPasswords, createPassword} = require("../controllers/passControllers")
const protect = require("../middlewares/protect")

router.post("/getPass", protect , allPasswords)
router.post("/create/password", protect , createPassword)

module.exports = router