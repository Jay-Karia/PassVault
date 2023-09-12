const asyncHandler = require("express-async-handler")

const Password = require("../models/passModel")
const User = require("../models/userModel")

const getPasswords = asyncHandler(async (req, res) => {
    try {
        const passwords = await Password.find({user: req.user})
        return res.status(200).json({msg:"Successfully Loaded Passwords!", passwords: passwords, status:"success"})
    } catch (error) {
        return res.status(400).json({msg:"Failed to load Passwords!", status:"error", error:error})
    }

})

const createPassword = asyncHandler(async (req, res) => {
    res.send("create password")
})

module.exports = {getPasswords, createPassword}