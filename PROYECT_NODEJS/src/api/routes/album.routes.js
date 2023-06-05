const express = require("express");
const albumRouter = express.Router();

const {getAlbum, postAlbum, putAlbum, deleteAlbum, getAlbumPaginado} = require("../controllers/album.controllers")
const {isAuth} = require("../../middlewares/auth")
const upload = require("../../middlewares/upload.file");

albumRouter.get("/pagina", [isAuth], getAlbumPaginado)
albumRouter.get("/", [isAuth], getAlbum)

albumRouter.post('/', [isAuth], upload.single('imagen'), postAlbum)
albumRouter.put("/:id", [isAuth], putAlbum)
albumRouter.delete("/:id", [isAuth], deleteAlbum)

module.exports = albumRouter