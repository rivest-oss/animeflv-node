<div align="center">
	<p>
		<a href="https://animeflv.net/">
			<img src="https://box.lolisbox.xyz/J4DHRa.svg" width="478" title="AnimeFLV.net" />
		</a>
	</p>
	<br />
	<p>
		<a href="https://discord.com/invite/X3Ph2jWy5U" alt="Servidor de soporte de animeflv.js">
			<img src="https://img.shields.io/discord/767675922119393301?color=3181b0&logo=discord&logoColor=white"></img>
		</a>
		<a href="https://www.npmjs.com/package/animeflv.js">
			<img src="https://img.shields.io/npm/v/animeflv.js.svg?maxAge=3600" alt="npm version"></img>
		</a>
		<a href="https://www.npmjs.com/package/animeflv.js">
			<img src="https://img.shields.io/npm/dt/animeflv.js.svg?maxAge=3600" alt="npm downloads"></img>
		</a>
	</p>
</div>

## Acerca de
`animeflv.js` es un módulo de Node.js para poder interactuar con [AnimeFLV](https://animeflv.net/).

Puede buscar animes, obtenerlos y hasta ver los enlaces de descarga de todos los episodios.

**Advertencia:** Este módulo no está de ninguna manera afiliado a AnimeFLV. Todo usuario de este módulo releva de todo cargo a los creadores, desarrolladores y todo aquél involucrado en el desarrollo del módulo.

## Instalación
**¿Cómo instalarlo?**

```sh-session
npm install animeflv.js
```

## Ejemplos de uso

#### Buscar un anime:
```js
// Requerir el módulo
const animeflv = require("animeflv.js");

// Buscar un anime
animeflv.search("boku no hero").then(async resultados => {
	console.log(resultados);
}).catch(async err => {
	// Capturas el error
});
```
[![Resultado del "search"](https://i.imgur.com/Z7iaFBI.png "Resultado del 'search'")](https://i.imgur.com/Z7iaFBI.png)

## Soporte

Si no entiendes algo, estás experimentando problemas o necesitas ser simplemente guiado, no dudes en unirte a [nuestro servidor de Discord](https://discord.com/invite/X3Ph2jWy5U).
