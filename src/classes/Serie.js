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

module.exports = Serie;
