const express = require("express");

const dotenv = require("dotenv");
dotenv.config();


const artistRouter = require("./src/api/routes/artist.routes");
const albumRouter = require("./src/api/routes/album.routes");
const userRouter = require("./src/api/routes/user.routes");

const{connect} = require("./src/utils/db.js")
const {isAuth} = require("./src/middlewares/auth")
const cors = require("cors")

const PORT = process.env.PORT
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });
const app = express();



connect ();

//VAMOS A PONER DE RESPUESTA
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, PATCH'); //Decimos que metodos tenemos permitidos
  res.header('Access-Control-Allow-Credentials', 'true'); //permitimos la conexión con credenciales(Bearer token)
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // permitimos los headers del tipo Content-Type
  next();
})

//VAMOS A CONFIGURAR LOS CORS
//CORS --> CORS ORIGIN RESOURCE SHARING --> Intercambio de recursos cruzados -> manera de permir el compartir recursos enntre distintos origenes
app.use(cors(
  {
    // origin: ["http://localhost:5000", "http://127.0.0.1:5000"],  //si tenemos varios origenes podemos ponerlos en un array
    origin: "*", // permito todas las conexiones
    credentials: true
  }
))

app.use(express.json()); 
app.use(express.urlencoded({extended: false}));
app.use("/artist", artistRouter);
app.use("/albums", albumRouter);
app.use("/user", userRouter);

app.listen(PORT,  () => console.log('listening on port', PORT));

