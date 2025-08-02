import express from 'express'
import 'dotenv/config'
import authRoutes  from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
import bookRoutes from './routes/bookRoutes.js'
import cors from "cors"
import job from './lib/cron.js'

const app = express()
const PORT = process.env.PORT || 5000


job.start() // Start the cron job
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


app.use('/api/auth', authRoutes )
app.use('/api/book', bookRoutes)

app.get("/", (req,res)=>{
    res.send("BOOKWORM API")
})


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})



