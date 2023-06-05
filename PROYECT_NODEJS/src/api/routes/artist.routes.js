const express = require("express");
const artistRouter = express.Router();

const {getArtist, postArtist, putArtist, deleteArtist} = require("../controllers/artist.controllers");
const { isAuth, isAdmin} = require("../../middlewares/auth");

artistRouter.get("/", [isAuth], getArtist)
artistRouter.post("/", postArtist)
artistRouter.put("/:id", putArtist)
artistRouter.delete("/:id", deleteArtist)

module.exports = artistRouter