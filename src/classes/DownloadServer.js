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

module.exports = DownloadServer;
