const register = async(req, res) => {
    res.send("this is register api")
}

const login = async(req, res) => {
    res.send("this is login api")
}

module.exports = { register, login }