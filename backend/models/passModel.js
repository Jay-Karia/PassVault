const mongoose = require("mongoose")

const passwordModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    websiteURL: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

const Password = mongoose.model("Password", passwordModel)
module.exports = Password