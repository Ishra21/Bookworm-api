import mongoose from 'mongoose'

export const connectDB = async() => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected ${conn.connection.name}`)
    } catch (error) {
        console.log("Error connection to database ", error)
        process.exit(1) //exit with failure
    }
}