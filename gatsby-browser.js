const injectBodyMovinScript = () => {
	const s = document.createElement("script");

	s.type = "text/javascript";
	s.src =
		"https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.1/lottie.min.js";
	document.getElementsByTagName("head")[0].appendChild(s);
};

let injectedScript = false;

exports.onRouteUpdate = () => {
	if (window.lottie) {
		window.lottie.destroy();
	}

	const elements = document.querySelectorAll(".lottie");
	if (elements.length) {
		elements.forEach(el => {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		});

		if (!injectedScript) {
			injectBodyMovinScript();
			injectedScript = true;
		} else {
			if (window.lottie) {
				window.lottie.searchAnimations();
			}
		}
	}
};
