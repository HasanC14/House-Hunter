const User = require('../model/User')
const bcryptjs = require('bcryptjs')
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
    return res.status(201).json({message:'Login successful'})
}
exports.Register = Register;
exports.Login = Login;
