const mongoose = require("mongoose");
const Schema = mongoose.Schema 

const albumSchema = new Schema(
    {
        name: {type:String, require:true},
        year: {type:String, require:true},
        single: {type:String, require:true},
        imagen: {type:String}
},{
   timestamps: true 
})

const album = mongoose.model("album", albumSchema);

module.exports = album;