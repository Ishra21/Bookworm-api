import express from  'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
const router = express.Router()

const generateToken = (userId) =>{
return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"})
}


router.post('/register', async(req,res) =>{
    // res.send("Register")
    try {
const {email ,username,password} = req.body

if(!username || !email || !password){
    return res.status(400).json({message : "All fields are required"})
}
if(password.length < 6){
    return res.status(400).json({message : "Password should be at least 6 characters long"}) 
}

if(username.length < 3){
return res.status(400).json({message : "Username should be at least 3 characters long"}) 
}

/* check if user already exist */
const emailExist = await User.findOne({email})

if(emailExist){
    return res.status(400).json({message : "Email Already exists"})
}

const userNameExist = await User.findOne({username})

if(userNameExist) {
    return res.status(400).json({message : "UserName Already exists"})
}
//get random avatar
const profileImage = `https://api.dicebear.com/7.x.avataaars/svg?seed=${username}`;

const user = new User({
    email,
    username,
    password,
    profileImage
})

await user.save()

const token = generateToken(user._id)

res.status(201).json({
    token,
    user :{
        _id : user._id,
        username : user.username,
        email : user.email,
        profileImage : user.profileImage
    }
})
} 

catch (error) {
        console.log("Error in register router", error)
        res.status(500).json({message : "Internal server error"})
    }
})



// login
router.post('/login',async (req,res) =>{
    // res.send("Login")

    try {
        const {email, password} = req.body 

        if(!email || !password){
        return res.status(400).json({message : "All fields are required"})
    }

    const user = await User.findOne({email})

    if(!user) {
        return res.status(400).json({message : "Invalid credentials!!!!!!"})
    }
    
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        return res.status(400).json({message :"Invalid credentials"})
    }

const token = generateToken(user._id)

res.status(201).json({
    token,
    user :{
        _id : user._id,
        username : user.username,
        email : user.email,
        profileImage : user.profileImage
    }
})
    
    } catch (error) {
  console.log("Error in login router", error)
        res.status(500).json({message : "Internal server error"})
    }
})



export default router