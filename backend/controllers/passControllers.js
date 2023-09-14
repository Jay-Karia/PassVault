const asyncHandler = require("express-async-handler")

const Password = require("../models/passModel")

// TODO: Encrypt and Decrypt password while creating or getting password

const allPasswords = asyncHandler(async (req, res) => {
    const userId = req.user.id
    try {
        const passwords = await Password.find({user: userId}).populate("user", "-password")

        if (passwords.length === 0)
            return res.status(400).json({msg: "No passwords found!", status: "warning"})

        return res.status(200).json({msg: "Successfully Loaded Passwords!", passwords: passwords, status: "success"})
    } catch (error) {
        return res.status(400).json({msg: "Failed to load Passwords!", status: "error", error: error})
    }
})

const createPassword = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const {title, description, websiteURL} = req.body

    try {

        if (!title || title.length === 0) {
            return res.status(400).json({msg: "Title not specified!", status: "error"})
        }

        let password = await Password.create({
            title, description, websiteURL, user: userId
        })

        password = await Password.findById(password.id).populate("user", "-password")

        return res.status(200).json({msg: "Password Created Successfully!", password: password, status: "success"})

    } catch (error) {
        return res.status(400).json({msg: "Failed to creat password!", status: "error", error: error})
    }
})

const getPassword = asyncHandler(async (req, res) => {
    const passwordID = req.params.id

    try {
        const password = await Password.findById(passwordID).populate("user", "-password")
        if (password.user.id !== req.user.id) // for security purpose (optional)
            return res.status(400).json({msg: "No passwords found with the given ID!", status: "error"})

        return res.status(200).json({msg: "Successfully Loaded Passwords!", passwords: password, status: "success"})
    } catch (error) {
        return res.status(400).json({msg: "Failed to fetch password!", status: "error", error: error})
    }
})

module.exports = {allPasswords, createPassword, getPassword}