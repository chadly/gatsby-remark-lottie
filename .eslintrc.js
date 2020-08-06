module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: ["@runly"],
	rules: {
		"import/no-commonjs": "off"
	}
};
