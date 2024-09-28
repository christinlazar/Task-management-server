const verifyJWT = require('../utils/JwtToken')

const authenticateUser =  async (req,res,next) =>{
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        console.log(token)
        const validToken = await verifyJWT.verifyJWT(token)
        if(validToken){
            next()
        }else{
            return res.status(400).json({success:false,JWT:false})
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {authenticateUser}