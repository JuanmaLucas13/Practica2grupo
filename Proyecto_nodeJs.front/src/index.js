const DB_URL = 'http://localhost:5000'
const fldEmail$$ = document.querySelector('#email');
const fldpasswd$$ = document.querySelector('#password');
const btnLogin$$ = document.querySelector('.btn-add');
let tokenRecuperado = '';
let estado = 0 // indica la pagina en la que estamos:
               // 0 - pendiente de login
               // 1 - login hecho OK
               // 2 - pendiente de registro.

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

        if (index % 2 == 1)
        {
           newColumn1$$.classList.add("pares");
           newColumn2$$.classList.add("pares");
        }

        newLine$$.appendChild(newColumn1$$);
        newLine$$.appendChild(newColumn2$$);
        tBody$$.appendChild(newLine$$);

        index = index + 1;
    }    
}

const cargarArtistas = () => {
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

const cargarAlbums = () => {
   //oculto todo lo relacionado con artistas, por si estuviera relleno.
   const ListadoArt$$ = document.querySelector('.ListadoArtistas');
   ListadoArt$$.style.display= 'none';
   const tBodyArt$$ = document.body.querySelector('.bodyArt');
   tBodyArt$$.style.display = 'none';
   tBodyArt$$.innerHTML = '';

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

const ActualizarPagina = () => {
  if (estado == 1)
  {
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

const postData = async (data = {}) => {
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
    .catch((error) => {
        console.log(' error petición Fetch:' + error.message)}
    );

    return response.json(); // parses JSON response into native JavaScript objects
  }


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

    postData(data)
        .then(auxdata => {
            console.log(auxdata); // JSON data parsed by `data.json()` call
            tokenRecuperado = auxdata.token;
            //console.log(tokenRecuperado);
            estado = 1;
            ActualizarPagina();
          })
        .catch(error => {
           console.log('Hubo un problema con la petición Fetch:' + error.message)});

    // console.log('va guay');
}

estado = 0;
btnLogin$$.addEventListener('click', btnPulsado);


