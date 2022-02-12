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

module.exports = Episode;
