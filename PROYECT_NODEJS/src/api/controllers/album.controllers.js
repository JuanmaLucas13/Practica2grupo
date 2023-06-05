const { deleteFile } = require("../../middlewares/delete.file");
const album = require("../models/album.models")


const getAlbum = async(req, res) => {
    try {
        const allAlbum = await album.find();
        if (allAlbum.length == 0)
            return res.status(404).json({message: "No hay albumas informados"})
        
        return res.status(200).json(allAlbum);
    } catch (error) { 
        return res.status(500).json(error)
    }
}

//GET PAGINADO
const getAlbumPaginado = async(req,res) => {
    try {
        //Recoger querys de numero de pagina(page) y limite por pagina(limit)
        let {page, limit} = req.query;
        
        //Contar el numero de elementos en mi coleccion
        const numAlbums = await album.countDocuments();
        
        //Si no está seteado seteo el limite a 5
        limit = limit ? parseInt(limit) || 5 : 5;

        //Comprobar el numero máximo de paginas dependiendo de mi limite
        let numPages = numAlbums%limit > 0 ? numAlbums/limit + 1 : numAlbums/limit;

        //Si no está seteado seteo el numero de pagina a 1
        page = page > numPages ? numPages : page < 1 ? 1 :  parseInt(page) || 1;
        // if(page > numPages){
        //     page = numPages;
        // }else if(page < 1){
        //     page = 1
        // }else{
        //     page = page
        // }

        // Calculo el salto(skip) que tengo que dar a mi find para empezar a partir del elemento que quiero
        const skip = (page - 1) * limit;

        const allAlbums = await album.find().skip(skip).limit(limit);
        const response = {
            info: {
                numAlbums: numAlbums,
                page: page,
                limit: limit,
                nextPage: numPages >= page + 1 ? `/pagina?page=${page + 1}&limit=${limit}` : null,
                previusPage: page != 1 ? `/pagina?page=${page - 1}&limit=${limit}` : null
            },
            results: allAlbums
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error)
    }
}

const postAlbum = async(req, res) => {
    try {
        const newAlbum = new album(req.body)
        if (req.file)
        {
           newAlbum.imagen = req.file.path;
        }    
        const createdAlbum = await newAlbum.save()
        
    return res.status(201).json(createdAlbum);
    } catch (error) { 
        return res.status(500).json(error)
}
}

const putAlbum = async(req, res) => {
    try {
        const {id} = req.params;
        const putAlbum = new album(req.body)
        putAlbum._id=id;
        if (req.file)
        {
           putAlbum.imagen = req.file.path;
        }    
        
        const updatedAlbum = await album.findByIdAndUpdate(id, putAlbum);
        if (!updatedAlbum){
            return res.status(404).json({message: "El Id de este albuma no existe"})
        }
        if(updatedAlbum.imagen !== putAlbum.imagen){
            deleteFile(updatedAlbum.imagen);
        }
        return res.status(200).json(updatedAlbum)   
    } catch (error) { 
        return res.status(500).json(error)
    }
}

const deleteAlbum = async(req, res) => {
    try {
        const {id} = req.params
        const deletedAlbum = await album.findByIdAndDelete(id);
        if(!deletedAlbum) {
            return res.status(404).json({message: "El Id de este albuma no existe"})
        }
        //console.log(deletedAlbum.imagen);
        deleteFile(deletedAlbum.imagen)
        return res.status(200).json(deletedAlbum)
    } catch (error) { 
        return res.status(500).json(error)
    }
}

module.exports = {getAlbum, postAlbum, putAlbum, deleteAlbum, getAlbumPaginado}