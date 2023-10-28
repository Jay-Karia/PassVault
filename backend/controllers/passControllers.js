const asyncHandler = require("express-async-handler")

const Password = require("../models/passModel")
const genPassword = require("../functions/genPassword")
const passStrength = require("../functions/passStrength")
const CryptoJS = require("crypto-js");

// TODO Encrypt and Decrypt Passwords (in-progress)

async function encrypt(password) {
    return await CryptoJS.AES.encrypt(password, 'secret key 123').toString()
}

async function decrypt(password) {
    let bytes = await CryptoJS.AES.decrypt(password, 'secret key 123');
    return bytes.toString(CryptoJS.enc.Utf8)
}

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
    const {title, description, websiteURL, password, email} = req.body

    try {

        if (!title || title.length === 0) {
            return res.status(400).json({msg: "Title not specified!", status: "error"})
        } else if (!password || password.length === 0)
            return res.status(400).json({msg: "Password not specified!", status: "error"})

        let newPassword = await Password.create({
            title, description, websiteURL, user: userId, password, email
        })

        newPassword = await Password.findById(newPassword.id).populate("user", "-password")

        return res.status(200).json({msg: "Password Created Successfully!", password: newPassword, status: "success"})

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

        return res.status(200).json({msg: "Successfully Loaded Password!", password: password, status: "success"})
    } catch (error) {
        return res.status(400).json({msg: "Failed to fetch password!", status: "error", error: error})
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    const passwordID = req.params.id
    const {title, description, websiteURL, password, email} = req.body

    try {
        let newPassword = await Password.findById(passwordID).populate("user", "-password")
        if (newPassword.user.id !== req.user.id) // for security purpose (optional)
            return res.status(400).json({msg: "No passwords found with the given ID!", status: "error"})

        let updatedPassword = await Password.findById(passwordID).populate("user", "-password")
        await Password.updateOne({_id: passwordID}, {$set: {title, description, websiteURL, password, email}})

        return res.status(200).json({
            msg: "Successfully Updated Password!",
            password: updatedPassword,
            status: "success"
        })
    } catch (error) {
        return res.status(400).json({msg: "Failed to update password!", status: "error", error: error})
    }
})

const deletePassword = asyncHandler(async (req, res) => {
    const passwordID = req.params.id

    try {
        const newPassword = await Password.findById(passwordID).populate("user", "-password")

        if (newPassword.user.id !== req.user.id) // for security purpose (optional)
            return res.status(400).json({msg: "No passwords found with the given ID!", status: "error"})

        await Password.deleteOne({_id: passwordID})
        return res.status(200).json({msg: "Successfully Deleted Password!", status: "success"})

    } catch (error) {
        return res.status(400).json({msg: "Failed to delete password!", status: "error", error: error})
    }

})

const generatePassword = asyncHandler(async (req, res) => {
    const {length, symbols = "", numbers = "", type, count, syllables = "", dashes = ""} = req.body

    try {
        const passwords = await genPassword(length, symbols, numbers, type, count, syllables, dashes)

        return res.status(200).json({msg: "Successfully Generated Password!", status: "success", passwords: passwords})
    } catch (error) {
        return res.status(400).json({msg: "Failed to generate password!", status: "error", error: error})
    }

})

const passwordStrength = asyncHandler(async (req, res) => {
    const {password} = req.body;

    const strength = passStrength(password);

    // return res.send("password strength", strength)
    return res.status(200).json({msg: "Password Strength Checked!", status: "success", strength: strength})
})

module.exports = {
    allPasswords,
    createPassword,
    getPassword,
    updatePassword,
    deletePassword,
    generatePassword,
    passwordStrength
}