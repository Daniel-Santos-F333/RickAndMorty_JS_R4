// API URL
const apiBase = 'https://rickandmortyapi.com/api/character';
let totalPages = 1; //Variable para almacenar el total de páginas disponibles
let currentPage = 1; //Variable para almacenar la página actual

const result = document.getElementById('results');
const loader = document.getElementById('loader');
const pageInfo = document.getElementById('pageInfo');

// Form inputs
const nameInput = document.getElementById('name');
const statusSelect = document.getElementById('status');
const speciesSelect = document.getElementById('species');

// Buttons
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

async function fetchCharacters(page=1) { //Función para obtener los personajes de la API
    const name = nameInput.value;  //Obtenemos el valor del input de nombre
    const status = statusSelect.value; //Obtenemos el valor del select de estado
    const species = speciesSelect.value; //Obtenemos el valor del select de especie

    loader.classList.remove('hidden'); //Para mostrar el spiner de carga que estaba oculto en el css

    result.innerHTML = ''; //Para limpiar resultados anteriores

    try {
        const response =await fetch(`${apiBase}/?page=${page}&name=${name}&status=${status}&species=${species}`); //Hacemos la petición a la API con los parámetros de búsqueda y paginación

        if(!response.ok) {
            throw new Error('No se encontraron resultados'); //Si la respuesta no es ok, lanzamos un error para mostrar el mensaje de no resultados
        }

        const data = await response.json(); //Obtenemos los datos de la respuesta en formato JSON

        totalPages = data.info.pages; //Actualizamos el total de páginas disponibles con el valor obtenido de la respuesta

        currentPage = page; //Actualizamos la página actual con el valor de la función

        displayCharacters(data.results); //Llamamos a la función para mostrar los personajes obtenidos
        
        updatePagination(); //Llamamos a la función para actualizar la información de paginación
    } catch (error) {
        results.innerHTML = `<p class="error">${error}</p>`; //Si ocurre un error, mostramos el mensaje de error en el contenedor de resultados
        pageInfo.textContent = ''; //Limpiamos la información de paginación
        console.log(error); //Mostramos el error en la consola para depuración
    } finally {
        loader.classList.add('hidden'); //Ocultamos el spiner de carga
    }
}

function displayCharacters(characters) { //Función para mostrar los personajes en el contenedor de resultados
    results.innerHTML = ''; //Limpiamos el contenedor de resultados antes de mostrar los nuevos personajes
    
    characters.forEach(character => { //Iteramos sobre el array de personajes obtenido de la API
        const card = document.createElement("div"); //Creamos un elemento div para cada personaje
        card.classList.add('card'); //Agregamos la clase 'card' al div para aplicar estilos
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p><strong>Estado:</strong>${character.status}</p> 
            <p><strong>Especie:</strong>${character.species}</p> 
            <p><strong>Origen:</strong>${character.origin.name}</p>`;
            results.appendChild(card); //Agregamos la tarjeta del personaje al contenedor de resultados
    });
}

function updatePagination() {
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`; //Actualizamos el texto de la información de paginación con la página actual y el total de páginas
    prevBtn.disabled = currentPage === 1; //Deshabilitamos el botón de página anterior si estamos en la primera página
    nextBtn.disabled = currentPage === totalPages; //Deshabilitamos el botón de página siguiente si estamos en la última página
}

searchBtn.addEventListener('click', () => fetchCharacters(1)); //Agregamos un evento al botón de búsqueda para llamar a la función de obtener personajes con la página 1

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) { //Si la página actual es mayor a 1, llamamos a la función de obtener personajes con la página anterior
        fetchCharacters(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) { //Si la página actual es menor al total de páginas, llamamos a la función de obtener personajes con la página siguiente
        fetchCharacters(currentPage + 1);
    }
});

clearBtn.addEventListener('click', () => { //Agregamos un evento al botón de limpiar para limpiar los campos de búsqueda y los resultados
    nameInput.value = '';
    statusSelect.value = '';
    speciesSelect.value = '';
    results.innerHTML = '';
    pageInfo.textContent = '';
    totalPages = 1;
    currentPage = 1;
});