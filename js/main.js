const listaPokemon = document.querySelector('#listaPokemon');
const url = 'https://pokeapi.co/api/v2/pokemon/';
const btnHeader = document.querySelectorAll('.btn-header');

// Cargar los primeros 151 Pokémon al inicio
cargarPokemons();

function cargarPokemons() {
    let pokemones = []; // Array para almacenar los Pokémon

    let promises = []; // Array para almacenar las promesas de fetch
    for (let i = 1; i < 152; i++) {
        promises.push(fetch(url + i).then(res => res.json()));
    }

    // Ejecutar todas las peticiones en paralelo
    Promise.all(promises)
        .then(data => {
            pokemones = data.sort((a, b) => a.id - b.id); // Ordenar por ID
            listaPokemon.innerHTML = ""; // Limpiar antes de agregar
            pokemones.forEach(pokemon => mostrarPokemon(pokemon)); // Pintar en orden
        })
        .catch(error => console.error('Error al obtener los Pokémon:', error));
}

function mostrarPokemon(data) {
    let tipos = data.types.map(tipo => tipo.type.name);
    let pokeId = data.id.toString().padStart(3, "0"); // Formato con ceros

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
     <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-image">
            <img src="${data.sprites.other["official-artwork"].front_default}" alt="imagen ${data.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">${pokeId}</p>
                <h2 class="pokemon-nombre">${data.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos.map(tipo => `<p class="${tipo} tipo">${tipo.toUpperCase()}</p>`).join('')}
            </div>
            <div class="pokemon-stats">
                <p class="altura">${data.height / 10}m</p>
                <p class="peso">${data.weight / 10}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// Filtrar por tipo cuando se presiona un botón
btnHeader.forEach(boton => boton.addEventListener('click', (event) => {
    const btnId = event.currentTarget.id;
    
    let promises = [];
    for (let i = 1; i < 152; i++) {
        promises.push(fetch(url + i).then(res => res.json()));
    }

    Promise.all(promises)
        .then(data => {
            let pokemones = data.sort((a, b) => a.id - b.id); // Ordenar por ID
            listaPokemon.innerHTML = ""; // Limpiar antes de agregar

            pokemones.forEach(pokemon => {
                const tipos = pokemon.types.map(tipo => tipo.type.name);
                if (btnId === 'ver-todos' || tipos.includes(btnId)) {
                    mostrarPokemon(pokemon);
                }
            });
        })
        .catch(error => console.error('Error al obtener los Pokémon:', error));
}));
