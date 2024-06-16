const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('server connected')
    } catch (error) {
        console.log('server connection failed')

    }
}

module.exports = connectDB;