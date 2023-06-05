const mongoose = require("mongoose");
const Schema = mongoose.Schema 

const userSchema = new Schema(
    {
        email: {type:String, require:true},
        password: {type:String, require:true},
        role: {type:String, default:"user", enum:["admin", "user", "moderator"]}
},{
   timestamps: true 
})

const User = mongoose.model("user", userSchema);

module.exports = User