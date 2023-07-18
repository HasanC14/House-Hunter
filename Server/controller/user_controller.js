const User = require('../model/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Register = async (req, res, next)=>{
    const {name, email, password, role} = req.body
    let   ExistingUser 
    try {
        ExistingUser = await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }
    if(ExistingUser){
        return res.status(400).json({message:'User already exists'})
    }
    const HashedPassword = bcryptjs.hashSync(password)
    const user = new User({
        name,
        password: HashedPassword,
        email,
        role,
    })
    try {
        user.save()
    } catch (error) {
        console.log(error);
    }
    return res.status(201).json({message:user})
}
const Login = async (req, res, next)=>{
    const {email, password} = req.body
    let   ExistingUser 
    try {
        ExistingUser = await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }
    if(!ExistingUser){
        return res.status(400).json({message:'User not found'})
    }
    const isPasswordCorrect = bcryptjs.compareSync(password, ExistingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:'Invalid email or Password'})
    }
    const token = jwt.sign({id: ExistingUser._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1hr'})
    return res.status(201).json({message:'Login successful', token})
}

const VerifyToken = async (req, res, next)=>{
    const headers = req.headers['authorization']
    const token = headers.split(' ')[1]
    if(!token){
        return res.status(400).json({message:'No token found'})
    }
    jwt.verify(String(token), process.env.ACCESS_TOKEN_SECRET, (error, user)=>{
        if(error){
            return res.status(400).json({message:'Invalid token'})
        }
        console.log(user.id);
        req.id = user.id
    })
    next()
}

const GetUser = async (req, res, next)=>{
    const UserId = req.id
    let user
    try {
        user = await User.findById(UserId, '-password')
    } catch (error) {
        console.log(error);
    }
    if(!user){
        return res.status(400).json({message:'No user found'})
    }
    return res.status(201).json({user})
}

exports.Register = Register;
exports.Login = Login;
exports.VerifyToken = VerifyToken;
exports.GetUser = GetUser;
