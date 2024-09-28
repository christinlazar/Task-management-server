
const ACCESS_TOKEN_SECRET = "AccessTokenSecret123@"
const REFRESH_TOKEN_SECRET = "RefreshTokenSecret123@"
const jwt = require('jsonwebtoken')
async function verifyJWT(token){
    try {
        const jwtKey = ACCESS_TOKEN_SECRET 
        const decode = jwt.verify(token,jwtKey)
        return decode
    } catch (error) {
        return null
    }
}
async function createJWT(userID){

    const jwtKey = ACCESS_TOKEN_SECRET 
    if(jwtKey){
        const token = jwt.sign({id:userID},jwtKey,{expiresIn:'7d'})
        return token
    }
    throw new Error('Jwt key is not defined')
}
async function createRefreshToken(userID){
   
    const refreshTokenKey = REFRESH_TOKEN_SECRET
    if(refreshTokenKey){
        const refreshToken = jwt.sign({id:userID},refreshTokenKey,{expiresIn:'7d'})
        return refreshToken;
    }
    throw new Error('Refresh token is no defined')
}
async function verifyRefreshToken(token){
    try {
        const refreshToken = REFRESH_TOKEN_SECRET 
        const decode = jwt.verify(token,refreshToken) 
        return decode
    } catch (error) {
        console.log(error.message)
        return null
    }
}

module.exports = {
    verifyJWT,
    createJWT,
    createRefreshToken,
    verifyRefreshToken
}