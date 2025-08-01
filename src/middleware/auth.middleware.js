import jwt from 'jsonwebtoken'
import User from '../models/User.js'


const protectRoute =  async (req,res, next) =>{
    try {
        // get token
        const token = req.header("Authorization").replace("Beared", "")
        if(!token){
            return res.status(401).json({message : "No authentication token, access denied"})
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // find the user
        const user = await User.findById(decoded.userID).select("-password")
        if(!user){
            return res.status(401).json({message : "Token is not valid"})
        }

        req.user = user
        next()
    } 
    catch (error) {
        console.log("Authentication error:", error.message)
        res.status(401).json({message : "Token is not valid"})
    }
}

export default protectRoute