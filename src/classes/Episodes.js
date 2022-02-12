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

module.exports = Episodes;
