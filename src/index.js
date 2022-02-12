var cloudscraper = require(`cloudscraper`);
var { JSDOM } = require(`jsdom`);

function capitalize(str) {
	return `${str.at(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
}

/**
 * URL base de las peticiones HTTP
 * @constant
 * @typedef {String} baseURL
 */
const baseURL = typeof process.env.ANIMEFLV_BASE_URL == `string` ? process.env.ANIMEFLV_BASE_URL : `https://www3.animeflv.net`;
const cdnBaseURL = typeof process.env.ANIMEFLV_CDN_BASE_URL == `string` ? process.env.ANIMEFLV_CDN_BASE_URL : `https://cdn.animeflv.net`;

/**
 * Tipo de anime (TV o OVA)
 * @typedef {"tv" | "ova" | "película" | "precuela" | "secuela" | String} AnimeType
 */

/**
 * Retorna el tipo de anime desde datos en crudo
 * @param {String} str Tipo de anime en crudo
 * @returns {String}
 */
function _animeType(str) {
	switch(str.toLowerCase()) {
		case `tv`: return `tv`; break;
		case `ova`: return `ova`; break;
		case `película`: case `movie`: return `película`; break;
		case `(precuela)`: return `precuela`; break;
		case `(secuela)`: return `secuela`; break;
		default: return str; break;
	}
}

/**
 * Estado del anime
 * @-typedef {String} AnimeStatus
 */

/**
 * Retorna el estado del anime desde datos en crudo
 * @param {String} str Estado del anime en crudo
 * @returns {AnimeStatus}
 */
function _animeStatus(str) {
	switch(str.toLowerCase()) {
		case `proximamente`: return `proximamente`; break;
		case `en emision`: return `en emisión`; break;
		case `finalizado`: return `finalizado`; break;
		default: return str; break;
	}
}

/**
 * Formato de doblaje del episodio
 * @typedef {"subtitulado" | "doblado" | String} DubFormat
 */

/**
 * Retorna el formato de doblaje del episodio desde datos en crudo
 * @param {String} str Formato de doblaje del episodio
 * @returns {DubFormat}
 */

function _dubFormat(str) {
	switch(str.toLowerCase()) {
		case `sub`: return `subtitulado`; break;
		case `dub`: return `doblado`; break;
		default: return str; break;
	}
}

Object.assign(globalThis, require(`${__dirname}/loader.js`));
console.log(`Anime:`, Anime);

/**
 * Fetchear un episodio de un anime en concreto
 * @async
 * @argument {AnimeEpisode} animeEpisode Un AnimeEpisode
 * @returns {Promise<Episode|Error>}
 */
async function getEpisode(animeEpisode) {
	return new Promise(async(resolve, reject) => {
		cloudscraper.get(`${animeEpisode.url}`).then(async textRes => {
			return resolve(new Episode(animeEpisode, textRes));
		}).catch(reject);
	});
}

/**
 * Busca animes de manera simple (sin filtros)
 * @async
 * @param {String} query Términos a buscar
 * @returns {Promise<SearchResult[]|Error>}
 * @example
 * // Buscar un anime
 * animeflv.search("boku no hero").then(async animes => {
 * 	console.log(animes);
 * 	/* →
 * 	[
 * 		SearchResult {
 * 			id: 2430,
 * 			title: 'Boku no Hero Academia',
 * 			type: 'TV',
 * 			lastID: '5148',
 * 			slug: 'boku-no-hero-academia-2016'
 * 		},
 * 		SearchResult {
 * 			id: 3337,
 * 			title: 'Boku no Hero Academia: Ikinokore! Kesshi no Survival Kunren',
 * 			type: 'OVA',
 * 			lastID: '5776',
 * 			slug: 'boku-no-hero-academia-ikinokore-kesshi-no-survival-kunren'
 * 		},
 * 		. . .
 * 	]
 * 	*\/
 * }).catch(async err => {
 * 	// Catch error
 * });
 */
async function search(query) {
	var query = query;

	return new Promise(async(resolve, reject) => {
		if(!query) return reject(new Error(`Debes ingresar un argumento para el método "search".`));
		if(typeof query !== `string`) return reject(new TypeError(`Debes ingresar un argumento String válido para el método "search".`));
		if(query.length < 3) return reject(new RangeError(`Debes ingresar al menos tres caracteres en el primer argumento para el método "search".`));
		query = query.slice(0, 64);

		cloudscraper.post(`${baseURL}/api/animes/search?value=${encodeURIComponent(query)}`).then(async textRes => {
			try {
				if((/<h1>Internal Error<\/h1>/g).test(textRes)) {
					return reject(textRes);
				}

				return resolve(JSON.parse(textRes).map(x => new SearchResult(x)));
			} catch(err) {
				return reject(err);
			}
		}).catch(reject);
	});
}

module.exports = {
	search,
	SearchResult,
	AnimeEpisode,
};
