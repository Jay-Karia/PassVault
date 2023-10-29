const express = require("express")
const router = express.Router()

const {allPasswords, createPassword, getPassword, updatePassword, deletePassword, generatePassword, passwordStrength, passwordCheckup} = require("../controllers/passControllers")
const protect = require("../middlewares/protect")

router.post("/getPass", protect , allPasswords)
router.post("/create/password", protect , createPassword)
router.post("/get/password/:id", protect, getPassword)
router.put("/update/password/:id", protect, updatePassword)
router.delete("/delete/password/:id", protect, deletePassword)
router.post("/gen/password", protect, generatePassword)
router.post("/strength", protect, passwordStrength)
router.post("/checkup", protect, passwordCheckup)

module.exports = router