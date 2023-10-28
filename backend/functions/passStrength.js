const {passwordStrength} = require("check-password-strength")

function passStrength (password) {
    return passwordStrength(password).value
}

module.exports = passStrength