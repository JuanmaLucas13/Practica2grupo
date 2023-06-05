const cloudinary = require('cloudinary').v2;

const deleteFile = (url) => {
    const imgSplitted = url.split('/'); //genero un array de cada elemento que está separado por /
    const nameSplitted = imgSplitted[imgSplitted.length - 1].split('.'); //hago un array que me separe el nombre de la imagen de su extension
    const folder = imgSplitted[imgSplitted.length - 2];

    const imgToDelete = `${folder}/${nameSplitted[0]}`;
    //console.log(imgToDelete);
    cloudinary.uploader.destroy(imgToDelete, () => console.log('Imagen borrada'));
}

module.exports = {deleteFile}