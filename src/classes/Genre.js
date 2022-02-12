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

module.exports = Genre;
