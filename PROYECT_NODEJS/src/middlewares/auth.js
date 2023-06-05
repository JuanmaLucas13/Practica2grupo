const { verifySign } = require("../utils/jwt");
const User = require("../api/models/user.models")

const isAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization){
           return res.status(401).json({message: "unauthorized"})
        }
        const token = authorization.split(" ")[1]
            if (!token){
                return(401).json({message: "Invalid token"})
            }
            const tokenVerify = verifySign(token)
            if (!tokenVerify.id){
                return(401).json({tokenVerify})
            }
            const userLogged = await User.findById(tokenVerify.id)
            req.user = userLogged
        next() 

    } catch (error) {
        return res.status(500).json(error)
    }
    
}

const isAdmin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization){
           return res.status(401).json({message: "unauthorized"})
        }
        const token = authorization.split(" ")[1]
            if (!token){
                return(401).json({message: "Invalid token"})
            }
            const tokenVerify = verifySign(token)
            if (!tokenVerify.id){
                return(401).json({tokenVerify})
            }
            const userLogged = await User.findById(tokenVerify.id)
            req.user = userLogged;

            if (userLogged.role !== "admin"){
                return res.status(401).json({message: "Need to be Admin"})
            }
        next() 

    } catch (error) {
        return res.status(500).json(error)
    }
    
}  


module.exports = {isAuth, isAdmin}