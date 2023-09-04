const express = require('express')
const dotenv = require("dotenv")
const cors = require("cors")

const app = express()
dotenv.config()
const port = process.env.PORT || 5000
app.use(cors())

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

// database
const connectDB = require("./database/connectDB")
connectDB()

// routing
const authRoutes = require("./routes/authRoutes")

app.use("/auth", authRoutes)