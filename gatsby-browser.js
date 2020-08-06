const getOptions = require("./opts");

const injectBodyMovinScript = ({ renderer, lottieVersion }) => {
	const s = document.createElement("script");

	s.type = "text/javascript";
	s.src = `https://cdnjs.cloudflare.com/ajax/libs/bodymovin/${lottieVersion}/${getScriptType(
		renderer
	)}`;
	document.getElementsByTagName("head")[0].appendChild(s);
};

const getScriptType = renderer => {
	switch (renderer) {
		case "svg":
		case "html":
		case "canvas":
			return `lottie_${renderer}.min.js`;

		default:
			return "lottie.min.js";
	}
};

let injectedScript = false;

exports.onRouteUpdate = (p, pluginOptions) => {
	if (window.lottie) {
		window.lottie.destroy();
	}

	const elements = document.querySelectorAll(".lottie");
	if (elements.length) {
		elements.forEach(el => {
			// clear the current SVG placeholder so lottie can do its thing
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		});

		if (!injectedScript) {
			injectBodyMovinScript(getOptions(pluginOptions));
			injectedScript = true;
		} else {
			if (window.lottie) {
				window.lottie.searchAnimations();
			}
		}
	}
};
