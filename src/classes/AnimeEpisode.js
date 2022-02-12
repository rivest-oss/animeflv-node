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

module.exports = AnimeEpisode;
