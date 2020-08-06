const path = require("path");
const fs = require("fs").promises;

const visit = require("unist-util-visit");
const renderToSvg = require("lottie-to-svg");

const getOptions = require("./opts");

const isLottieAnimation = node =>
	node.type === "image" && node.url.endsWith(".json");

module.exports = async ({ markdownAST }, pluginOptions) => {
	const nodes = [];
	visit(markdownAST, "image", node => {
		if (isLottieAnimation(node)) {
			nodes.push(node);
		}
	});

	const {
		renderer,
		loop,
		autoplay,
		generatePlaceholders,
		rendererSettings
	} = getOptions(pluginOptions);

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[0];

		const svgPreview = await loadSvgPreview(
			generatePlaceholders,
			node.url,
			rendererSettings
		);

		node.type = "html";
		node.value = `<div class="lottie" data-animation-path="${node.url}" data-anim-type="${renderer}" data-anim-loop="${loop}" data-anim-autoplay="${autoplay}">${svgPreview}</div>`;
		node.children = null;
	}

	return markdownAST;
};

async function loadSvgPreview(generatePlaceholder, url, rendererSettings) {
	if (!generatePlaceholder) return "";

	const lottiePath = path.join("./public", url);
	const jsonContent = await fs.readFile(lottiePath, "utf8");
	const animationData = JSON.parse(jsonContent);

	return await renderToSvg(animationData, rendererSettings);
}
