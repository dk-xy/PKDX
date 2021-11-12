
//fonctions de bases
//FUNCTIONS DE BASE---------------------------------------------------------------
//I fonction récoltée durant le cours
//I
//
function domOn(selector, event, callback) {
    domForEach(selector, ele => ele.addEventListener(event, callback));
}

// Param: selecteur + fonction a lancer
function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
}

/** 
* Effectue plusieurs requêtes HTTP GET afin d'aller charger les URLs pointant
* sur des données au format JSON. La fonction retourne un tableau contenant tous
* les résultats ("désérialisés"). 
* 
* @param {array} urls Les URLs à charger (dont le contenu est du JSON)
* @return {array} un tableau contenant les résultats de chaque requête 
*/
async function loadJsonUrls(urls) {
    const res = await Promise.all(urls.map(url => fetch(url)));
    return await Promise.all(res.map(r => r.json()));
}

// url unique !!
async function loadJson(url) {
    const response = await fetch(url);
    const data = response.json();
    return data;
    //return data.postalcodes;
}


async function makePokemon(pokemon) {
    let getImgLink = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

    tmpl = TMPL_PKMN.cloneNode(true);
    tmpl.querySelector('.pkmn-no').textContent += " " + pokemon.id;
    tmpl.querySelector('.pkmn-name').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);//char 1 en maj et le reste en min
    getImgLink += pokemon.id + '.png'
    tmpl.querySelector('img').setAttribute('src', getImgLink)
    let tabTypes = pokemon.types;
    //console.log(tabTypes)

    //ATTRIBUTION DES TYPE
    tabTypes.forEach(elm => {
        //console.log(elm.type.name)
        if (tmpl.querySelector('.pkmn-type').textContent == "") {
            tmpl.querySelector('.pkmn-type').textContent += elm.type.name;
            tmpl.querySelector('.pkmn-type').classList.add(elm.type.name)
        } else {
            tmpl.querySelector('.second').textContent += elm.type.name;
            tmpl.querySelector('.second').classList.add(elm.type.name)
        }
    })
    let currentNode = tmpl.querySelector('.pkmnContainer');
    getPkmnDescr(pokemon.id, currentNode)
    tmpl.classList.remove('tmpl')
    document.querySelector('#Pkmn-list').appendChild(tmpl)
}


async function getPkmnDescr(noPkmn, domNode) {
    let getDescrLink = 'https://pokeapi.co/api/v2/pokemon-species/'
    getDescrLink += noPkmn + "/"
    let arrayDescr = await loadJson(getDescrLink);
    //console.log(arrayDescr.genera[3].genus);
    domNode.querySelector('.backCard').textContent = arrayDescr.genera[3].genus
}



const LINK = 'https://pokeapi.co/api/v2/pokemon?limit=XXX&offset=Y'
const TMPL_PKMN = document.querySelector('.tmpl-pkmn');

domOn('.buttonSelection', 'click', async evt => {
    document.querySelector("#Pkmn-list").replaceChildren();
    document.querySelector('.loader').classList.add('fetch-loader');
    let LINK = 'https://pokeapi.co/api/v2/pokemon?limit=XXX&offset=Y'
    let linksToLoad = new Array();
    console.log(evt);
    let minCount = evt.target.getAttribute('pkmn-min-id')
    let maxCount = evt.target.getAttribute('pkmn-max-id')
    console.log(maxCount)
    LINK = LINK.replace('XXX', maxCount);
    LINK = LINK.replace('Y', minCount);
    console.log(LINK)
    let tableauClick = await loadJson(LINK)
    let arrayPkmn = tableauClick.results;
    let arrayUrls = tableauClick.results.url
    //console.log(arrayUrls)
    arrayPkmn.forEach(pkmn => {
        linksToLoad.push(pkmn.url)
    })

    //console.log(linksToLoad)
    let tabPkmnLoaded = await loadJsonUrls(linksToLoad);
    //console.log(tabPkmnLoaded)

    tabPkmnLoaded.forEach(pkmn => {
        makePokemon(pkmn)
    })
    document.querySelector('.loader').classList.remove('fetch-loader');


    //affichage description
    domOn('.tmpl-pkmn', 'click', evt => {
        console.log(evt.currentTarget)
        let front = evt.currentTarget.querySelector('.frontCard');
        let back = evt.currentTarget.querySelector('.backCard');
        if (!front.classList.contains('tmpl')) {
            front.classList.add('tmpl')
            back.classList.remove('tmpl')
        } else if (!back.classList.contains('tmpl')) {
            back.classList.add('tmpl')
            front.classList.remove('tmpl')
        }
    })

    // for (let i = minCount; i < maxCount; i++) {
    //     const pkmnLink = 'https://pokeapi.co/api/v2/pokemon/'
    //     const apiLink = pkmnLink + i;
    //     const tabData = await loadJson(apiLink)
    //         makePokemon(tabData);
    //         //console.log(tabData.name) 
    // }

})




