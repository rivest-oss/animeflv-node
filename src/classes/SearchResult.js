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

module.exports = SearchResult;
