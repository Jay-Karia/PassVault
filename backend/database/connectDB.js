const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const connectDB = async() => {
    const connectParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    try {
        await mongoose.connect(process.env.DB, connectParams)
        console.log("Connected to Database")
    } catch (error) {
        console.log("Error occurred while connecting to Database");
    }
}

module.exports = connectDB