require(`fs`)
	.readdirSync(`${__dirname}/classes`)
	.filter(x => (/\.js$/gim).test(x))
	.forEach(x => {
		let reqClass = require(`${__dirname}/classes/${x}`);
		module.exports[reqClass.name] = reqClass;
	});
