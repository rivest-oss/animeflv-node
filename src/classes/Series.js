/**
 * Contiene todas las "series" (precuelas y secuelas)
 * @-typedef {Array} Series
 */
class Series extends Array {
	constructor(series) {
		super();

		for(var serie of series) {
			if(serie instanceof Serie) {
				super.push(serie);
			} else {
				throw new TypeError(`El argumento "series" del constructor de la clase Series debe de ser un Array de Serie, no un Array de ${serie.constructor.name}.`);
			}
		}
	}
}

module.exports = Series;
