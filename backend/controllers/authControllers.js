const generateToken = require("../config/generateToken")

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")

let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    let valid = emailRegex.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    let parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    let domainParts = parts[1].split(".");
    return !domainParts.some(function (part) {
        return part.length > 63;
    });
}

const register = asyncHandler(async (req, res, next) => {
    // const user = JSON.parse(req.body)
    const user = req.body

    let passLength = user.password.length

    user.password = await bcrypt.hash(user.password, 10)
    user.name = user.name.toLowerCase()
    user.email = user.email.toLowerCase()


    if (!isEmailValid(user.email))
        return res.status(400).json({msg: 'Invalid Email', status: 'error'})
    else if (passLength <= 6)
        return res.status(400).json({msg: 'Password Length must be greater than 6', status: 'error'})
    else {
        const existingUser = await User.findOne({email: user.email})
        if (existingUser) return res.status(400).json({
            msg: 'User already exists. Try to Login instead',
            status: 'error'
        })

        let newUser;
        let token;

        try {
            newUser = new User(user)
            token = "Bearer " + generateToken(newUser.id)
            newUser.save()
        } catch (err) {
            return res.status(500).json({
                msg: 'Sorry! Some internal server error',
                error: JSON.stringify(err),
                status: 'error'
            })
        }
        return res.status(200).json({user: newUser, status: 'success', msg: 'Successfully Logged In!', token: token})
    }
})

const login = asyncHandler(async (req, res, next) => {
    // const user = JSON.parse(req.body)
    const user = req.body

    try {
        const existingUser = await User.findOne({email: user.email})
        if (existingUser) {
            bcrypt.compare(user.password, existingUser.password).then(match => {
                if (match) {
                    const payload = {
                        id: existingUser._id,
                    }
                    jwt.sign(payload, process.env.JWT_SECRET,
                        (err, token) => {
                            if (err) return res.status(400).json({msg: err, status: "error"})
                            return res.status(200).json({
                                user: existingUser,
                                status: 'success',
                                msg: 'Successfully Logged In!',
                                token: 'Bearer ' + token
                            })
                        })
                } else {
                    return res.status(400).json({msg: 'Email or password does not match', status: 'error'})
                }
            })
        } else {
            return res.status(400).json({msg: 'Email or password does not match', status: 'error'})
        }
    } catch (err) {
        return res.status(500).json({msg: 'Sorry! Some internal server error', error: err, status: 'error'})
    }
})

module.exports = {register, login}