const User = require("../api/models/user.models")

const validateEmail = (email) => {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regEx.test(String(email).toLowerCase())
    
}

const validatePassword = (password) => {
    const regEx = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return regEx.test(String(password))

}

const usedEmail = async (email) =>{
    const users = await User.find({email:email})
    return users.length
}

module.exports = {validateEmail, validatePassword, usedEmail}