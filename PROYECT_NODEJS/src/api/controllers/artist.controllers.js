const artist = require("../models/artist.models")


const getArtist = async(req, res) => {
    try {
        const allArtist = await artist.find().populate("createdAlbum")
        if (allArtist.length == 0)
            return res.status(404).json({message: "No hay artistas informados"})
        
        return res.status(200).json(allArtist);
    } catch (error) { 
        return res.status(500).json(error)
    }
}

const postArtist = async(req, res) => {
    try {
        const newArtist = new artist(req.body)
        const createdArtist = await newArtist.save()
        
    return res.status(201).json(createdArtist);
    } catch (error) { 
        return res.status(500).json(error)
}
}

const putArtist = async(req, res) => {
    try {
        const {id} = req.params;
        const putArtist = new artist(req.body)
        putArtist._id=id;
        const updatedArtist = await artist.findByIdAndUpdate(id, putArtist, {new:true});
        if (!updatedArtist){
            return res.status(404).json({message: "El Id de este artista no existe"})
        }
        return res.status(200).json(updatedArtist)   
    } catch (error) { 
        return res.status(500).json(error)
    }
}

const deleteArtist = async(req, res) => {
    try {
        const {id} = req.params
        const deletedArtist = await artist.findByIdAndDelete(id);
        if(!deletedArtist) {
            return res.status(404).json({message: "El Id de este artista no existe"})
        }
        return res.status(200).json(deletedArtist)
    } catch (error) { 
        return res.status(500).json(error)
    }
}

module.exports = {getArtist, postArtist, putArtist, deleteArtist}