const generateToken = require("../config/generateToken")

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const User = require("../Models/userModel")

const register = async(req, res) => {
    // const user = JSON.parse(req.body)
    const user = req.body

    user.password = await bcrypt.hash(user.password, 10)
    user.name = user.name.toLowerCase()
    user.email = user.email.toLowerCase()

    const existingUser = await User.findOne({ email: user.email })
    if (existingUser) return res.status(400).json({ msg: 'User already exists. Try to Login instead', status: 'error' })

    let newUser;
    let token;

    try {
        newUser = new User(user)
        token = "Bearer " + generateToken(newUser.id)
        newUser.save()
    } catch (err) {
        return res.status(500).json({ msg: 'Sorry! Some internal server error', error: JSON.stringify(err), status: 'error' })
    }
    return res.status(200).json({ user: newUser, status: 'success', msg: 'Successfully Logged In!', token: token })

}

const login = async(req, res) => {
    // const user = JSON.parse(req.body)
    const user = req.body
    const newUser = await User.findOne({ email: user.email })

    try {
        const existingUser = await User.findOne({ email: user.email })
        if (existingUser) {
            bcrypt.compare(user.password, existingUser.password).then(match => {
                if (match) {
                    const payload = {
                        id: existingUser._id,
                    }
                    jwt.sign(payload, process.env.JWT_SECRET,
                        (err, token) => {
                            console.log(token);
                            console.log(generateToken(newUser._id));
                            if (err) return res.status(400).json({ msg: err, status: "error" })
                            return res.status(200).json({ user: existingUser, status: 'success', msg: 'Successfully Logged In!', token: 'Bearer ' + token })
                        })
                } else {
                    return res.status(400).json({ msg: 'Email or password does not match', status: 'error' })
                }
            })
        } else {
            return res.status(400).json({ msg: 'Email or password does not match', status: 'error' })
        }
    } catch (err) {
        return res.status(500).json({ msg: 'Sorry! Some internal server error', error: err, status: 'error' })
    }
}

module.exports = { register, login }