const DB_URL = 'http://localhost:5000'
const fldEmail$$ = document.querySelector('#email');
const fldpasswd$$ = document.querySelector('#password');
const btnLogin$$ = document.querySelector('.btn-add');
const btnAnterior$$ = document.querySelector('.PaginaAnterior');
const btnSiguiente$$ = document.querySelector('.siguientePagina');

let tokenRecuperado = '';
let estado = 0 // indica la pagina en la que estamos:
               // 0 - pendiente de login
               // 1 - login hecho OK
               // 2 - pendiente de registro.
let sigPage = '';
let antPage = '';

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
       const newImg2$$ = document.createElement('img');
       newImg2$$.className = 'opcImagen'
       newImg2$$.src = './assets/boli.svg'
       const newImg3$$ = document.createElement('img');
       newImg3$$.className = 'opcImagen'
       newImg3$$.src = './assets/papelera.svg'

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

   let reqPagina = '';
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
      const newImg2$$ = document.createElement('img');
      newImg2$$.className = 'opcImagen'
      newImg2$$.src = './assets/boli.svg'
      const newImg3$$ = document.createElement('img');
      newImg3$$.className = 'opcImagen'
      newImg3$$.src = './assets/papelera.svg'

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
        const newImg2$$ = document.createElement('img');
        newImg2$$.className = 'opcImagen'
        newImg2$$.src = './assets/boli.svg'
        const newImg3$$ = document.createElement('img');
        newImg3$$.className = 'opcImagen'
        newImg3$$.src = './assets/papelera.svg'

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
     }  
     else
     {
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
         ActualizarPagina();
       }  
    })
  .catch(error => {
     console.log('Hubo un problema con la petición Fetch:' + error.message)});
 }

// Funcion para validar el email y password y solicitar al back, el login y el token.
const btnPulsado = (event) => {
    event.preventDefault();

    if (fldEmail$$.value.trim().length == 0 )
       return alert("Email no informado");

    if (fldpasswd$$.value.trim().length == 0 )
       return alert("Contraseña no informada");

    const regex1 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!regex1.test(fldEmail$$.value) )
       return alert("Email no cumple con los requisitos.");

    const regex2 = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!regex2.test(fldpasswd$$.value) )
       return alert("contraseña no cumple con los requisitos.");

    // enviamos el email y el password en formato json   
    const data = {email: fldEmail$$.value, password:fldpasswd$$.value};

    postData(data);

    // console.log('va guay');
}

//Inicio del programa.
estado = 0;
btnLogin$$.addEventListener('click', btnPulsado);
btnAnterior$$.addEventListener('click', pulsadoAnterior);
btnSiguiente$$.addEventListener('click', pulsadoSiguiente);


