const mongoose = require("mongoose");
const Schema = mongoose.Schema 

const artistSchema = new Schema(
    {
        name: {type:String, require:true},
        nationality: {type:String, require:true},
        birthYear: {type:Number, require:true},
        createdAlbum: [{type: Schema.Types.ObjectId, ref:"album"}]
},{
   timestamps: true 
})

const artist = mongoose.model("artist", artistSchema);

module.exports = artist;

