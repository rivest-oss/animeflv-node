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

module.exports = AnimeFollower;
