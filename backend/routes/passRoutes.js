const express = require("express")
const router = express.Router()

const {getPasswords, createPassword} = require("../controllers/passControllers")

router.post("/getPass", getPasswords)
router.post("/create/password", createPassword)

module.exports = router