module.exports = function getDefaultOptions(options) {
	options = options || {};
	return {
		generatePlaceholders: true,
		lottieVersion: "5.7.1",
		renderer: "svg",
		loop: true,
		autoplay: true,
		...options
	};
};
