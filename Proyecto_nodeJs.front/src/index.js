const DB_URL = 'http://localhost:5000'
const fldEmail$$ = document.querySelector('#email');
const fldpasswd$$ = document.querySelector('#password');
const fldEmailReg$$ = document.querySelector('#emailReg');
const fldpasswdReg$$ = document.querySelector('#passwordReg');

const fldErrorMsg$$ = document.querySelector('.errorMsg');
const fldErrorMsg1$$ = document.querySelector('.errorMsg1');
const btnLogin$$ = document.querySelector('.btn-add');
const btnRegistro$$ = document.querySelector('.btn-registro');
const btnAlta$$ = document.querySelector('.btn-add1');
const btnVolver$$ = document.querySelector('.cierreSesion1');
const btnAnterior$$ = document.querySelector('.PaginaAnterior');
const btnSiguiente$$ = document.querySelector('.siguientePagina');
const btnLogout$$ = document.querySelector('.cierreSesion');

let tokenRecuperado = '';
let statusBack = 0; // indicador sobre errores devueltos del back

let estado = 0; // indica la pagina/seccion en la que estamos:
                // 0 - pendiente de login
                // 1 - login hecho OK - consultas
                // 2 - pendiente de registro - en formulario registro
let sigPage = '';
let antPage = '';
let ListadoAlbum = 0;
let reqPagina = '';

const getAlbum = (event) => {
   console.log ("Album consultado", event.target.id)
}

const updateAlbum = (event) => {
   console.log ("Album actualizado", event.target.id)
}

// funcion que llama al API para borrar un album
const borrarAlbum = async (id) => {
   let responseStatus = 0;

   const url = `${DB_URL}/albums/${id}`
   // Opciones por defecto estan marcadas con un *
   const response = await fetch(url, {
       method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
       headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ tokenRecuperado
       },
   })
   .then (response => {
       responseStatus = response.status;
       return response.json() 
   })
   .catch((error) => {
       console.log(' error petición Fetch-Delete:' + error.message)}
   )
   .then(auxdata => {
     if (responseStatus == 200)
      {
         if (ListadoAlbum == 1 )
            cargarAlbums();
         else
            cargarAlbumsPag ({}, reqPagina);
      }  
   })
 .catch(error => {
    console.log('Hubo un problema con la petición Fetch-delete:' + error.message)});
}

// funcion eventlistener asociada a borrar album
const deleteAlbum = (event) => {
   borrarAlbum (event.target.id);
}


//Funciones para Artistas.

const getArtista = (event) => {
   console.log ("Artista consultado", event.target.id)
}

const updateArtista = (event) => {
   console.log ("Artista actualizado", event.target.id)
}

const deleteArtista = (event) => {
   console.log ("Artista borrado", event.target.id)
}
const pulsadoAnterior = (event) => {
   cargarAlbumsPag (event, antPage);
}

const pulsadoSiguiente = (event, pagina) => {
   cargarAlbumsPag (event, sigPage);
}

//Funcion para mostrar en la pagina html, el listado de albums
const mostrarAlbumsPag = (myJson) => {
   // console.log(myJson);
   let index = 0;

   let numeroPaginas = (myJson.info.numAlbums / myJson.info.limit) + 
        ((myJson.info.numAlbums % myJson.info.limit > 0) ? 1: 0);

   const numPaginas$$ = document.body.querySelector('.numPaginas');
   numPaginas$$.value = `Pagina ${myJson.info.page} de ${numeroPaginas}`

   const tBody$$ = document.body.querySelector('.bodyAlb');
   tBody$$.innerHTML = '';

   for (const iterator of myJson.results) {
       const newLine$$ = document.createElement('tr')
       
       const newColumn1$$ = document.createElement('td')
       newColumn1$$.textContent = iterator.name;
       const newColumn2$$ = document.createElement('td')
       newColumn2$$.textContent = iterator.year;

       const newColumn3$$ = document.createElement('td')
       const newDivImg$$ = document.createElement('div')
       newDivImg$$.className = 'columnaImagen'

       const newImg1$$ = document.createElement('img');
       newImg1$$.className = 'opcImagen'
       newImg1$$.src = './assets/lupa2.svg'
       newImg1$$.id = iterator._id;
       newImg1$$.addEventListener('click', getAlbum);

       const newImg2$$ = document.createElement('img');
       newImg2$$.className = 'opcImagen'
       newImg2$$.src = './assets/boli.svg'
       newImg2$$.id = iterator._id;
       newImg2$$.addEventListener('click', updateAlbum);

       const newImg3$$ = document.createElement('img');
       newImg3$$.className = 'opcImagen'
       newImg3$$.src = './assets/papelera.svg'
       newImg3$$.id = iterator._id;
       newImg3$$.addEventListener('click', deleteAlbum);

       newDivImg$$.appendChild(newImg1$$);
       newDivImg$$.appendChild(newImg2$$);
       newDivImg$$.appendChild(newImg3$$);
       newColumn3$$.appendChild(newDivImg$$);
       
       if (index % 2 == 1)
       {
          newColumn1$$.classList.add("pares");
          newColumn2$$.classList.add("pares");
          newColumn3$$.classList.add("pares");
       }
       else
       {
          newColumn1$$.classList.add("impares");
          newColumn2$$.classList.add("impares");
          newColumn3$$.classList.add("impares");
       }
 
       newLine$$.appendChild(newColumn1$$);
       newLine$$.appendChild(newColumn2$$);
       newLine$$.appendChild(newColumn3$$);
       tBody$$.appendChild(newLine$$);

       index = index + 1;
   }    
   // console.log(myJson.info.page)
      
   if (myJson.info.page == 1)
    {
      //oculto el boton anterior, ya que estoy en la primera pagina
      btnAnterior$$.style.display= 'none';
    }
   else
    {
      //visualizo el boton anterior, en el resto de paginas
      btnAnterior$$.style.display= 'flex';
    }

   if (!myJson.info.nextPage)
    {
      //oculto el boton siguiente, ya que estoy en la ultima pagina
      btnSiguiente$$.style.display= 'none';
    }      
   else
   {
      //visualizo el boton, en el resto de paginas
      btnSiguiente$$.style.display= 'flex';
    }      

   sigPage = myJson.info.nextPage;
   antPage = myJson.info.previusPage;
   // console.log(myJson.info);
   // console.log(sigPage);
   // console.log(antPage);
}


//funcion para invocar al API y recuperar los albums de forma paginada.
const cargarAlbumsPag = (event, pagina = '') => {
   //oculto todo lo relacionado con artistas, por si estuviera relleno.
   const ListadoArt$$ = document.querySelector('.ListadoArtistas');
   ListadoArt$$.style.display= 'none';
   const tBodyArt$$ = document.body.querySelector('.bodyArt');
   tBodyArt$$.innerHTML = '';

   //Visualizo los botones de paginacion
   const btnPaginas$$ = document.querySelector('.btnPaginas');
   btnPaginas$$.style.display= 'flex';
               
   //visualizo la parte de Albums, para la consulta.
   const ListadoAlbums$$ = document.querySelector('.ListadoAlbums');
   ListadoAlbums$$.style.display= 'block';

   ListadoAlbum = 2
   if (!pagina)
      reqPagina = '/pagina';
   else
      reqPagina = pagina;

   // console.log(reqPagina);
   // console.log(`solicitud: ${DB_URL}/albums${reqPagina}`);
   
   fetch (`${DB_URL}/albums${reqPagina}`,  {
       method: 'GET', // *GET, POST, PUT, DELETE, etc.
       headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ tokenRecuperado
       }
    })
    .then (res => res.json())
    .then ( myJson => {mostrarAlbumsPag(myJson)} );
 }
               
//Funcion para mostrar en la pagina html, el listado de artistas
const mostrarArtistas = (myJson) => {
   // console.log(myJson);
   let index = 0;
              
   const tBody$$ = document.body.querySelector('.bodyArt');
   tBody$$.innerHTML = '';
              
   for (const iterator of myJson) {
      const newLine$$ = document.createElement('tr')
                      
      const newColumn1$$ = document.createElement('td')
      newColumn1$$.textContent = iterator.name;
      const newColumn2$$ = document.createElement('td')
      newColumn2$$.textContent = iterator.birthYear;

      const newColumn3$$ = document.createElement('td')
      const newDivImg$$ = document.createElement('div')
      newDivImg$$.className = 'columnaImagen'
      const newImg1$$ = document.createElement('img');
      newImg1$$.className = 'opcImagen'
      newImg1$$.src = './assets/lupa2.svg'
      newImg1$$.id = iterator._id;
      newImg1$$.addEventListener('click', getArtista);

      const newImg2$$ = document.createElement('img');
      newImg2$$.className = 'opcImagen'
      newImg2$$.src = './assets/boli.svg'
      newImg2$$.id = iterator._id;
      newImg2$$.addEventListener('click', updateArtista);

      const newImg3$$ = document.createElement('img');
      newImg3$$.className = 'opcImagen'
      newImg3$$.src = './assets/papelera.svg'
      newImg3$$.id = iterator._id;
      newImg3$$.addEventListener('click', deleteArtista);

      newDivImg$$.appendChild(newImg1$$);
      newDivImg$$.appendChild(newImg2$$);
      newDivImg$$.appendChild(newImg3$$);
      newColumn3$$.appendChild(newDivImg$$);
            
      if (index % 2 == 1)
      {
         newColumn1$$.classList.add("pares");
         newColumn2$$.classList.add("pares");
         newColumn3$$.classList.add("pares");
      }
      else
      {
         newColumn1$$.classList.add("impares");
         newColumn2$$.classList.add("impares");
         newColumn3$$.classList.add("impares");
      }
              
      newLine$$.appendChild(newColumn1$$);
      newLine$$.appendChild(newColumn2$$);
      newLine$$.appendChild(newColumn3$$);
      tBody$$.appendChild(newLine$$);
              
      index = index + 1;
   }    
}
              
//Funcion para mostrar en la pagina html, el listado de albums
const mostrarAlbums = (myJson) => {
    // console.log(myJson);
    let index = 0;

    const tBody$$ = document.body.querySelector('.bodyAlb');
    tBody$$.innerHTML = '';

    for (const iterator of myJson) {
        const newLine$$ = document.createElement('tr')
        
        const newColumn1$$ = document.createElement('td')
        newColumn1$$.textContent = iterator.name;
        const newColumn2$$ = document.createElement('td')
        newColumn2$$.textContent = iterator.year;

        const newColumn3$$ = document.createElement('td')
        const newDivImg$$ = document.createElement('div')
        newDivImg$$.className = 'columnaImagen'

        const newImg1$$ = document.createElement('img');
        newImg1$$.className = 'opcImagen'
        newImg1$$.src = './assets/lupa2.svg'
        newImg1$$.id = iterator._id;
        newImg1$$.addEventListener('click', getAlbum);

        const newImg2$$ = document.createElement('img');
        newImg2$$.className = 'opcImagen'
        newImg2$$.src = './assets/boli.svg'
        newImg2$$.id = iterator._id;
        newImg2$$.addEventListener('click', updateAlbum);

        const newImg3$$ = document.createElement('img');
        newImg3$$.className = 'opcImagen'
        newImg3$$.src = './assets/papelera.svg'
        newImg3$$.id = iterator._id;
        newImg3$$.addEventListener('click', deleteAlbum);

        newDivImg$$.appendChild(newImg1$$);
        newDivImg$$.appendChild(newImg2$$);
        newDivImg$$.appendChild(newImg3$$);
        newColumn3$$.appendChild(newDivImg$$);
        
        if (index % 2 == 1)
        {
           newColumn1$$.classList.add("pares");
           newColumn2$$.classList.add("pares");
           newColumn3$$.classList.add("pares");
        }
        else
        {
           newColumn1$$.classList.add("impares");
           newColumn2$$.classList.add("impares");
           newColumn3$$.classList.add("impares");
        }
  
        newLine$$.appendChild(newColumn1$$);
        newLine$$.appendChild(newColumn2$$);
        newLine$$.appendChild(newColumn3$$);
        tBody$$.appendChild(newLine$$);

        index = index + 1;
    }    
}

//Funcion para solicitar al back, la lista de artistas
const cargarArtistas = () => {
   //oculto todo lo relacionado con artistas, por si estuviera relleno.
   const ListadoAlb$$ = document.querySelector('.ListadoAlbums');
   ListadoAlb$$.style.display= 'none';
   const tBodyAlb$$ = document.body.querySelector('.bodyAlb');
   tBodyAlb$$.innerHTML = '';

   //visualizo la parte de Albums, para la consulta.
   const ListadoArtistas$$ = document.querySelector('.ListadoArtistas');
   ListadoArtistas$$.style.display= 'block';

    fetch (`${DB_URL}/artist`,  {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ tokenRecuperado
      }
     })
    .then (res => res.json())
    .then ( myJson => {mostrarArtistas(myJson)} );
}

//Funcion para solicitar al back, la lista de albums
const cargarAlbums = () => {
   //oculto todo lo relacionado con artistas, por si estuviera relleno.
   const ListadoArt$$ = document.querySelector('.ListadoArtistas');
   ListadoArt$$.style.display= 'none';
   const tBodyArt$$ = document.body.querySelector('.bodyArt');
   tBodyArt$$.innerHTML = '';

   //Oculto botones de paginacion
   const btnPaginas$$ = document.querySelector('.btnPaginas');
   btnPaginas$$.style.display= 'none';

   //visualizo la parte de Albums, para la consulta.
   const ListadoAlbums$$ = document.querySelector('.ListadoAlbums');
   ListadoAlbums$$.style.display= 'block';

   ListadoAlbum = 1;

   fetch (`${DB_URL}/albums`,  {
     method: 'GET', // *GET, POST, PUT, DELETE, etc.
     headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ tokenRecuperado
     }
    })
   .then (res => res.json())
   .then ( myJson => {mostrarAlbums(myJson)} );
}

const cerrarSession = () => {
   tokenRecuperado = '';
   estado = 0;
   statusBack = 0; 
   sigPage = '';
   antPage = '';
   
   ActualizarPagina ();

}

const pulsadoRegistro = (event) => {
     event.preventDefault();
     estado = 2;
     ActualizarPagina();
}

//Funcion para visualizar la seccion que vamos a trabajar. 
// va en funcion de la variable estado, definida globalmente.
const ActualizarPagina = () => {
  if (estado == 1)
  { // hemos hecho login y vamos a visualizar las consultas.
    const formularioLogin$$ = document.querySelector('.formularioLogin');
    formularioLogin$$.style.display= 'none';

    const formularioRegister$$ = document.querySelector('.formularioRegister');
    formularioRegister$$.style.display= 'none';

    const seccionConsultas$$ = document.querySelector('.seccionConsultas');
    seccionConsultas$$.style.display= 'block';

    const ListadoBotones$$ = document.querySelector('.ListadoBotones');
    ListadoBotones$$.style.display= 'flex';
        
    const btnArtistas$$ = document.querySelector('.get_artistas');
    btnArtistas$$.addEventListener('click', cargarArtistas);

    const btnAlBums$$ = document.querySelector('.get_albums');
    btnAlBums$$.addEventListener('click', cargarAlbums);

    const btnAlBumsPag$$ = document.querySelector('.get_albumspag');
    btnAlBumsPag$$.addEventListener('click', cargarAlbumsPag);

    btnLogout$$.style.display = 'block';
  }
  else
  { 
     if (estado == 2)
     {
        //visualizar el formulario de registro y gestionarlo completamente.
        const formularioLogin$$ = document.querySelector('.formularioLogin');
        formularioLogin$$.style.display= 'none';
    
        const formularioRegister$$ = document.querySelector('.formularioRegister');
        formularioRegister$$.style.display= 'block';
    
        const seccionConsultas$$ = document.querySelector('.seccionConsultas');
        seccionConsultas$$.style.display= 'none';

        //oculto todo lo relacionado con artistas, por si estuviera relleno.
        const ListadoArt$$ = document.querySelector('.ListadoArtistas');
        ListadoArt$$.style.display= 'none';
        const tBodyArt$$ = document.body.querySelector('.bodyArt');
        tBodyArt$$.innerHTML = '';

        //oculto todo lo relacionado con albums, por si estuviera relleno.
        const ListadoAlb$$ = document.querySelector('.ListadoAlbums');
        ListadoAlb$$.style.display= 'none';
        const tBodyAlb$$ = document.body.querySelector('.bodyAlb');
        tBodyAlb$$.innerHTML = '';
        //Oculto botones de paginacion
        const btnPaginas$$ = document.querySelector('.btnPaginas');
        btnPaginas$$.style.display= 'none';

        //oculto el boton de logout
        btnLogout$$.style.display = 'none';
     }  
     else
     {  //formulario de login 
        if (statusBack == 0) 
        {
          //visualizar el formulario de login
          const formularioLogin$$ = document.querySelector('.formularioLogin');
          formularioLogin$$.style.display= 'block';
    
          //Oculto el formulario de registro
          const formularioRegister$$ = document.querySelector('.formularioRegister');
          formularioRegister$$.style.display= 'none';
    
          //Oculto el formulario de las consultas.
          const seccionConsultas$$ = document.querySelector('.seccionConsultas');
          seccionConsultas$$.style.display= 'none';

          //oculto el boton de logout
          btnLogout$$.style.display = 'none';

          //oculto todo lo relacionado con artistas, por si estuviera relleno.
          const ListadoArt$$ = document.querySelector('.ListadoArtistas');
          ListadoArt$$.style.display= 'none';
          const tBodyArt$$ = document.body.querySelector('.bodyArt');
          tBodyArt$$.innerHTML = '';

          //oculto todo lo relacionado con albums, por si estuviera relleno.
          const ListadoAlb$$ = document.querySelector('.ListadoAlbums');
          ListadoAlb$$.style.display= 'none';
          const tBodyAlb$$ = document.body.querySelector('.bodyAlb');
          tBodyAlb$$.innerHTML = '';

          //Oculto botones de paginacion
          const btnPaginas$$ = document.querySelector('.btnPaginas');
          btnPaginas$$.style.display= 'none';

        }
        // el formulario de login ha dado algun error.... gestionarlo.
     }
  }
}

// funcion para realizar el login. Envia al back, los datos del email y password
//   para validarlo.
const postData = async (data = {}) => {
    let responseStatus = 0;

    const url = `${DB_URL}/user/login`
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'no-cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
           'Content-Type': 'application/json'
        //    'Authorization': 'Bearer '+ tokenRecuperado
           // 'Content-Type': 'application/x-www-form-urlencoded',
        },

        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then (response => {
        responseStatus = response.status;
        return response.json() 
    })
    .catch((error) => {
        console.log(' error petición Fetch:' + error.message)}
    )
    .then(auxdata => {
      if (responseStatus == 200)
       {
         // console.log('auxdata:',auxdata); // JSON data parsed by `data.json()` call
         tokenRecuperado = auxdata.token;
         // console.log(tokenRecuperado);
         estado = 1;
         fldEmail$$.value = "";
         fldpasswd$$.value = "";
         fldErrorMsg$$.value = "";

         ActualizarPagina();
       }  
      else
      {
         fldErrorMsg$$.value = `** ${auxdata.message}`;

      //   console.log(auxdata.message)
      }
    })
  .catch(error => {
     console.log('Hubo un problema con la petición Fetch:' + error.message)});
 }

// funcion para realizar el registro. Envia al back, los datos del email y password
const postRegister = async (data = {}) => {
   let responseStatus = 0;

   const url = `${DB_URL}/user/register`
   // Opciones por defecto estan marcadas con un *
   const response = await fetch(url, {
       method: 'POST', // *GET, POST, PUT, DELETE, etc.
       // mode: 'no-cors', // no-cors, *cors, same-origin
       // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
       // credentials: 'same-origin', // include, *same-origin, omit
       headers: {
          'Content-Type': 'application/json'
       //    'Authorization': 'Bearer '+ tokenRecuperado
          // 'Content-Type': 'application/x-www-form-urlencoded',
       },

       // redirect: 'follow', // manual, *follow, error
       // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
       body: JSON.stringify(data) // body data type must match "Content-Type" header
   })
   .then (response => {
       responseStatus = response.status;
       return response.json() 
   })
   .catch((error) => {
       console.log(' error petición Fetch:' + error.message)}
   )
   .then(auxdata => {
     if (responseStatus == 201)
      {
         fldEmailReg$$.value = "";
         fldpasswdReg$$.value = "";
         fldErrorMsg1$$.value = "";
         postData(data);
      }  
     else
      {
        fldErrorMsg1$$.value = `** ${auxdata.message}`;
      }
   })
 .catch(error => {
    console.log('Hubo un problema con la petición Fetch:' + error.message)});
}

// funcion para controlar los datos introducidos en el formulario de registro
// y llamar al back con el registro
const registrarUsuario = (event) => {
   event.preventDefault();

   if (fldEmailReg$$.value.trim().length == 0 )
   {
      fldErrorMsg1$$.value = `** Email no informado`;
      return;
   }   

   const regex1 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   if (!regex1.test(fldEmailReg$$.value) )
   {
      fldErrorMsg1$$.value = `**Email no cumple con los requisitos.`;
      return;
   }   

   if (fldpasswdReg$$.value.trim().length == 0 )
   {
      fldErrorMsg1$$.value = `** Contraseña no informada`;
      return;
   }   

   const regex2 = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
   if (!regex2.test(fldpasswdReg$$.value) )
   {
      fldErrorMsg1$$.value = `** contraseña no cumple con los requisitos.`;
      return;
   }   
   // enviamos el email y el password en formato json   
   const data = {email: fldEmailReg$$.value, password:fldpasswdReg$$.value};

   postRegister(data);
}


// Funcion para validar el email y password y solicitar al back, el login y el token.
const btnPulsado = (event) => {
    event.preventDefault();

    if (fldEmail$$.value.trim().length == 0 )
    {
       fldErrorMsg$$.value = `** Email no informado`;
       return;
    }   

    if (fldpasswd$$.value.trim().length == 0 )
    {
       fldErrorMsg$$.value = `** Contraseña no informada`;
       return;
    }   

    const regex1 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!regex1.test(fldEmail$$.value) )
    {
       fldErrorMsg$$.value = `**Email no cumple con los requisitos.`;
       return;
    }   

    const regex2 = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!regex2.test(fldpasswd$$.value) )
    {
       fldErrorMsg$$.value = `** contraseña no cumple con los requisitos.`;
       return;
    }   

    // enviamos el email y el password en formato json   
    const data = {email: fldEmail$$.value, password:fldpasswd$$.value};

    postData(data);
    // console.log('va guay');
}

const limpiarError = () => {
   fldErrorMsg$$.value = '';
}

//Inicio del programa.
estado = 0;
btnLogin$$.addEventListener('click', btnPulsado);
btnRegistro$$.addEventListener('click', pulsadoRegistro);
btnAlta$$.addEventListener('click', registrarUsuario);
btnVolver$$.addEventListener('click', cerrarSession);
btnLogout$$.addEventListener('click', cerrarSession);
btnLogout$$.style.display = 'none';

btnAnterior$$.addEventListener('click', pulsadoAnterior);
btnSiguiente$$.addEventListener('click', pulsadoSiguiente);

fldEmail$$.addEventListener('input', limpiarError);
fldpasswd$$.addEventListener('input', limpiarError);



