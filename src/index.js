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

/**
 * Contiene todas las posibles precuelas y secuelas
 * @-typedef {Object} Serie
 * @property {String} title Título del anime
 * @property {String} url URL del anime
 * @property {AnimeType} type Tipo de anime ("precuela" o "secuela")
 */
class Serie {
	constructor(title, url, fullText) {
		Object.assign(this, {
			title,
			url: `${baseURL}${url}`,
			type: _animeType(fullText.match(/\([\w]+\)$/gm)[0]),
		});
	}

	/**
	 * Fetchear el Anime
	 * @async
	 * @returns {Promise<Anime|Error>}
	 */
	async getAnime() {
		return new Promise(async(resolve, reject) => {
			cloudscraper.get(this.url).then(async textRes => {
				return resolve(new Anime(textRes));
			}).catch(reject);
		});
	}
	
	/**
	 * Exportar como String
	 * @param {Boolean} formatAsMarkdown Exportar como texto formato Markdown
	 * @returns {String}
	 */
	toString(formatAsMarkdown=false) {
		return !formatAsMarkdown ? `${this.title} (${this.url}))` : `[${this.title}](${this.url})`;
	}
}

/**
 * Contiene todas las "series" (precuelas y secuelas)
 * @-typedef {Array} Series
 */
class Series extends Array {
	constructor(series) {
		super();

		for(var serie of series) {
			if(serie instanceof Serie) {
				super.push(serie);
			} else {
				throw new TypeError(`El argumento "series" del constructor de la clase Series debe de ser un Array de Serie, no un Array de ${serie.constructor.name}.`);
			}
		}
	}
}

/**
 * Seguidor(a) de un anime
 * @-typedef {Object} AnimeFollower
 * @property {String} username Nombre de usuari@ del/la seguidor(a)
 * @property {String} url URL del perfil del/la seguidor(a)
 * @property {String} avatar URL del avatar del/la seguidor(a)
 */
class AnimeFollower {
	constructor(tagA) {
		Object.assign(this, {
			username: tagA.getAttribute(`data-original-title`),
			url: `${baseURL}${tagA.href}`,
			avatar: `${baseURL}${tagA.children[0].src}`,
		});
	}

	/**
	 * Fetchear usuario
	*/
	async fetch() {
		//
	}
}

/**
 * Género de anime
 * @property {String} name Nombre del género
 * @property {String} slug Código slug del género
 * @property {String} url URL del género
 */
class Genre {
	constructor(name, url) {
		Object.assign(this, {
			name: name.toLowerCase(),
			slug: url.match(/[a-z-]+$/gm).at(0),
			url: `${baseURL}${url}`,
		});
	}

	/**
	 * Buscar animes por ese género
	 * @async
	 * @returns {Promise<BrowseResult|Error>}
	 */
	async browse() {
		return browse({
			genres: new Genres([
				this,
			]),
		});
	}

	/**
	 * Exportar como String
	 * @param {Boolean} formatAsMarkdown Exportar como texto formato Markdown
	 * @returns {String}
	 */
	toString(formatAsMarkdown=false) {
		return !formatAsMarkdown ? this.name : `[${capitalize(this.name)}](${this.url})`;
	}
}

/**
 * Géneros de anime
 * @-typedef {Array} Genres
 */
class Genres extends Array {
	constructor(genres) {
		super();

		for(var genre of genres) {
			if(genre instanceof Genre) {
				super.push(genre);
			} else {
				super.add(genre.slug);
			}
		}
	}

	/**
	 * Añade un género a la lista
	 * @param {String} slug Código slug del género a añadir
	 * @returns {Number}
	 */
	add(slug) {
		if(!slug) throw new Error(`El argumento "slug" del método "add" de la clase "Genres" debe estar definido.`);
		if(typeof slug !== `string`) throw new TypeError(`El argumento "slug" del método "add" de la clase "Genres" debe ser un String, no un ${slug.constructor.name}.`);
		if((/[^\w-]/g).test(slug)) throw new TypeError(`El argumento "slug" del método "add" de la clase "Genres" debe ser un Slug válido, no "${slug}".`);

		return super.push(slug);
	}

	push(x) {
		return this.add(x);
	}
	
	/**
	 * URL de la búsqueda
	 */
	get url() {
		return `${baseURL}/browse?${this.map(x => `genre%5B%5D=${x}`).join(`&`)}`;
	}

	/**
	 * Buscar animes por esos géneros
	 * @async
	 * @returns {Promise<BrowseResult|Error>}
	 */
	async browse() {
		return browse({
			genres: this,
		});
	}

	/**
	 * Exportar como String
	 * @param {Boolean} formatAsMarkdown Exportar como texto formato Markdown
	 * @returns {String}
	 */
	toString(formatAsMarkdown=false) {
		return !formatAsMarkdown ? super.join(`, `) : `[${super.join(`, `)}](${this.url})`;
	}

	/*-*
	 * Exportar como String
	 * @param {String} separador Especifica un String para separar los elementos del Genres (por defecto, ", ")
	 * @returns {String}
	 *-/
	/*
	toString(separador=`, `) {
		if(!separador) throw new Error(`El argumento "separador" del método "toString" de la clase "Genres" debe estar definido.`);
		if(typeof separador !== `string`) throw new TypeError(`El argumento "separador" del método "toString" de la clase "Genres" debe ser un String, no un ${separador.constructor.name}.`);
	
		return super.join(separador);
	}
	*/
}

/**
 * Servidor para descargar el episodio
 * @-typedef {Object} DownloadServer
 * @property {String} name Nombre del servidor
 * @property {String} mediaFormat Formato del multimedia
 * @property {DubFormat} dub Formato de doblaje
 * @property {String} url URL de descarga
 */
class DownloadServer {
	constructor(serverName, mediaFormat, subtitledOrDubbed, url) {
		Object.assign(this, {
			name: serverName,
			mediaFormat: mediaFormat,
			dub: _dubFormat(subtitledOrDubbed),
			url,
		});
	}
}

/**
 * Episodio de un anime
 * @-typedef {Object} Episode
 * @property {String} title Título del anime
 * @property {DownloadServer[]} downloads Servidores de descarga del episodio
 */
class Episode {
	constructor(animeEpisode, htmlText) {
		var dom = new JSDOM(htmlText);

		var downloads = Array.from(dom.window.document.getElementsByTagName(`tr`))
			.filter(x => !x.textContent.toLowerCase().includes(`servidor`));

		Object.assign(this, {
			episode: animeEpisode,
			title: dom.window.document.getElementsByClassName(`Title`)[1].textContent,
			downloads: downloads.map(x => new DownloadServer(
				x.children[0].textContent,
				x.children[1].textContent,
				x.children[2].textContent,
				x.children[3].children[0].href,
			)),
		});
	}
}

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
 * Episodio de un anime
 * @-typedef {Object} AnimeEpisode
 * @property {Number} index Índice del episodio
 * @property {String} url URL del episodio
 * @property {String[]} thumbnails URL de las portadas del episodio
 * @property {String} animeSlug Código slug del anime
 */
class AnimeEpisode {
	constructor(anime, index, id) {
		Object.assign(this, {
			anime,
			id,
			url: `${baseURL}/ver/${anime.slug}-${index}`,
			thumbnails: [1, 2, 3, 4, 5, 6].map(x => `${cdnBaseURL}/screenshots/${anime.id}/${index}/th_${x}.jpg`),
			index,
		});
	}

	/**
	 * @async
	 * @returns {Promise<Episode|Error>}
	 */
	async getEpisode() {
		return getEpisode(this);
	}
}

/**
 * Lista de episodios
 * @-typedef {Array} Episodes
 * @see {AnimeEpisode}
 */
class Episodes extends Array {
	constructor(htmlText, anime) {
		try {
			var arr = JSON.parse(htmlText.match(/var episodes = ([\d\[\],]+)/).at(1))
				.sort((x, y) => x[0] - y[0])
				.map(x => new AnimeEpisode(anime, x[0], x[1]));
			
			super(...arr);
		} catch(err) {
			return err;
		}
	}

	/**
	 * Obtener el episodio más reciente
	 * @returns {AnimeEpisode}
	 */
	latest() {
		return super.at(super.length - 1);
	}
}

/**
 * La página principal de un anime
 * @-typedef {Object} Anime
 * @property {String} title Título del anime
 * @property {String} slug Código slug del anime
 * @property {String} cover Cover del anime
 * @property {String} banner Banner del anime
 * @property {AnimeType} type Tipo de anime
 * @property {Number} followers Cantidad de seguidores que el anime posee
 * @property {Number} votes Votos totales del anime
 * @property {Number} averageVotes Promedio de puntuación del anime
 * @property {AnimeStatus} status Estado del anime
 * @property {AnimeFollower[]} followersList Lista de algunos seguidores del anime
 * @property {Genres} genres Géneros del anime
 * @property {Series} series Series del anime (precuelas y secuelas)
 * @property {Episodes} episodes Episodios del anime
 */
class Anime {
	constructor(htmlText) {
		var dom = new JSDOM(htmlText);
		this.id = parseInt(dom.window.document.getElementsByClassName(`Strs RateIt`)[0].getAttribute(`data-id`));

		var titles = Array.from(dom.window.document.getElementsByClassName(`Title`))
			.map(x => x.textContent);
		
		Array.from(dom.window.document.getElementsByTagName(`meta`))
			.forEach(meta => {
				switch(meta.name || meta.getAttribute(`property`)) {
					case `og:url`: this.url = meta.content; break;
					case `description`: this.sinopsis = meta.content; break;
				}
			});
		
		Object.assign(this, {
			title: titles.at(1),
			slug: this.url.match(/[\w-]+$/gm).at(0),
			cover: `${baseURL}/uploads/animes/covers/${this.id}.jpg`,
			banner: `${baseURL}/uploads/animes/banners/${this.id}.jpg`,
			type: _animeType(dom.window.document.getElementsByClassName(`Type`)[0].textContent),
			followers: parseInt(titles.at(2).match(/\d+/g)[0]),
			votes: parseInt(dom.window.document.getElementById(`votes_nmbr`).textContent),
			averageVotes: parseFloat(dom.window.document.getElementById(`votes_prmd`).textContent),
			status: _animeStatus(dom.window.document.getElementsByClassName(`fa-tv`)[0].textContent),
			followersList: Array.from(dom.window.document.getElementsByClassName(`ListImgrnd`)[0].children).map(x => new AnimeFollower(x.children[0])),
			genres: new Genres(Array.from(dom.window.document.getElementsByClassName(`Nvgnrs`)[0].children).map(x => new Genre(x.textContent, x.href))),
			series: new Series(Array.from(dom.window.document.getElementsByClassName(`fa-chevron-circle-right`)).map(x => new Serie(x.children[0].textContent, x.children[0].href, x.textContent))),
		});

		this.episodes = new Episodes(Array.from(dom.window.document.getElementsByTagName(`script`)).filter(x => x.textContent.includes(`episodes = `))[0].textContent, this);
	}

	/**
	 * Exportar como String
	 * @param {Boolean} formatAsMarkdown Exportar como texto formato Markdown
	 * @returns {String}
	 */
	toString(formatAsMarkdown=false) {
		// return !formatAsMarkdown ? this.url : `[${capitalize(this.title)}](${this.url})`;
		return !formatAsMarkdown ? `${this.name} (${this.url})` : `[![${this.name}](${this.cover})](${this.url})`;
	}
}

/**
 * Resultado de una búsqueda simple
 * @-typedef {Object} SearchResult
 * @property {Number} id ID del anime
 * @property {String} title Título del anime
 * @property {AnimeType} type Tipo de anime
 * @property {String} lastID Última ID
 * @property {String} slug Código slug del anime
 */
class SearchResult {
	constructor(raw) {
		Object.assign(this, {
			id: parseInt(raw.id),
			title: raw.title,
			cover: `${baseURL}/uploads/animes/covers/${raw.id}.jpg`,
			banner: `${baseURL}/uploads/animes/banners/${raw.id}.jpg`,
			type: _animeType(raw.type),
			lastID: parseInt(raw.last_id),
			slug: raw.slug,
			url: `${baseURL}/anime/${raw.slug}`,
		});
	}

	/**
	 * Fetchear el Anime
	 * @async
	 * @returns {Promise<Anime|Error>}
	 */
	async getAnime() {
		return new Promise(async(resolve, reject) => {
			cloudscraper.get(this.url).then(async textRes => {
				return resolve(new Anime(textRes));
			}).catch(reject);
		});
	}
	/**
	 * Fetchear el Anime
	 * @async
	 * @returns {Promise<Anime|Error>}
	 */
	async getAnime() {
		return new Promise(async(resolve, reject) => {
			cloudscraper.get(this.url).then(async textRes => {
				return resolve(new Anime(textRes));
			}).catch(reject);
		});
	}

	/**
	 * Exportar como String
	 * @param {Boolean} formatAsMarkdown Exportar como texto formato Markdown
	 * @returns {String}
	 */
	toString(formatAsMarkdown=false) {
		return !formatAsMarkdown ? `${this.title} (${this.url}))` : `[![${this.name}](${this.cover})](${this.url})`;
	}

	/**
	 * Exportar como String
	 * @param {Boolean} formatAsMarkdown Exportar como texto formato Markdown
	 * @returns {String}
	 */
	toString(formatAsMarkdown=false) {
		return !formatAsMarkdown ? `${this.title} (${this.url}))` : `[![${this.name}](${this.cover})](${this.url})`;
	}
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
