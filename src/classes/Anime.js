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

module.exports = Anime;
