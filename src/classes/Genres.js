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

module.exports = Genres;
