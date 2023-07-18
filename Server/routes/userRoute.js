const express = require("express");
const { Register, Login, VerifyToken, GetUser } = require("../controller/user_controller");

const router = express.Router()

router.get('/', (req, res, next)=>{
    res.send('API running')
})

router.post('/register', Register)
router.post('/login', Login)
router.get('/user', VerifyToken, GetUser)

module.exports = router