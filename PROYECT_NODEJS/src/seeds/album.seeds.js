const mongoose = require('mongoose');

const Album = require("../api/models/album.models");

const dotenv = require("dotenv");
dotenv.config();

const arrayAlbums = 
[{
 name:"Un Hombre De Verdad",
 year: "1998",
 single: "Un Hombre De Verdad"
},
{
 name:"Lo Mejor De Los Mejores",
 year: "1995",
 single: "A Quién Le Importa"
},
{
 name:"Alaska: El Huracán Mexicano",
 year: "1998",
 single: "Cómo Pudiste Hacerme Esto A Mí"
},
{
 name:"The Platinum Collection",
 year: "2007",
 single: "Horror En El Hipermercado"
},
{
 name:"Alaska Y Sus Canciones De La Movida",
 year: "2003",
 single: "Bailando"
},
{
name:"Juez y parte",
year: "1985", 
single: "Cuando era más joven"
},
{
name:"Joaquín Sabina y Viceversa en directo",
year: "1986", 
single: "Como decirte, como contarte"
},
{
name:"Hotel, dulce hotel",
year: "1987", 
single: "Besos de Juda"
},
{
name:"El hombre del traje gris",
year: "1988", 
single: "Nacidos para perder"
},
{
name:"Mentiras piadosas",
year: "1990", 
single: "Con la frente marchita"
},
{
name:"Descanso dominical",
year: "1988", 
single: "El blus del esclavo"
},
{
name:"Hawaii-Bombay y otros grandes éxitos",
year: "1991", 
single: "Hawaii-Bombay"
},
{
name:"Aidalai",
year: "1991", 
single: "Aidalai"
},
{
name:"Metalmorfosis",
year: "1983", 
single: "Tierra de vándalos"
},
{
name:"Tierra de vándalos",
year: "1985", 
single: "Cuerdas de acero"
},
{
name:"Tierra de nadie",
year: "1987", 
single: "La voz de su amo"
},
{
name:"No va más",
year: "1988", 
single: "Los domingos son aburridos"
},
{
name:"Obstinato",
year: "1989", 
single: "Herencia letal"
},
{
name:"Naufragios",
year: "1992", 
single: "Gritar al viento"
},
{
name:"El abrazo del erizo",
year: "1995", 
single: "Levanto el vuelo"
},
{
name:"Acróbatas",
year: "2000", 
single: "Todo es igual siempre"
},
{
name:"7 años",
year: "1989", 
single: "Carrusel "
},
{
name:"Te dejas ver",
year: "2000", 
single: "A flor de piel"
},
{
name:"Ciudades de paso",
year: "2003", 
single: "Sparring"
}
] 

mongoose.connect(process.env.DB_URL)
.then(async () => {
    const allAlbums = await Album.find();
    if (allAlbums.length > 0){
       await Album.collection.drop();
       console.log('Albums borrados')
    }   
} )
.catch ( (error) => console.log("error borrando albums", error))
.then ( async () => {
    const albumMap = arrayAlbums.map((itemAlbum) => new Album(itemAlbum));
    await Album.insertMany(albumMap);
    console.log ('Albums insertados');
})
.catch( (error) => console.log("error insertando albums", error))
.finally ( () => mongoose.disconnect())