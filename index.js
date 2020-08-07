const path = require("path");
const fs = require("fs").promises;

const visit = require("unist-util-visit");
const renderToSvg = require("lottie-to-svg");

const getOptions = require("./opts");

const isLottieAnimation = node =>
	node.type === "image" && node.url.endsWith(".json");

module.exports = async ({ markdownAST, cache }, pluginOptions) => {
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
		const node = nodes[i];

		const svgPreviewUrl = await loadSvgPreview({
			generatePlaceholders,
			url: node.url,
			rendererSettings,
			cache
		});

		node.type = "html";
		node.value = `<div class="lottie" data-animation-path="${
			node.url
		}" data-anim-type="${renderer}" data-anim-loop="${loop}" data-anim-autoplay="${autoplay}">
				${
					svgPreviewUrl
						? `<img src="${svgPreviewUrl}" alt="${node.alt}" title="${node.title}" />`
						: ""
				}
			</div>`;
		node.children = null;
	}

	return markdownAST;
};

async function loadSvgPreview({
	generatePlaceholders,
	url,
	rendererSettings,
	cache
}) {
	if (!generatePlaceholders) return "";

	const publicPath = path.join(process.cwd(), "public");
	const lottiePath = path.join(publicPath, url);

	const svgUrl = url.replace(".json", ".svg");
	const svgPath = path.join(publicPath, svgUrl);

	let result = await cache.get(svgUrl);

	if (!result) {
		const jsonContent = await fs.readFile(lottiePath, "utf8");
		const animationData = JSON.parse(jsonContent);

		result = await renderToSvg(animationData, rendererSettings);
		cache.set(svgUrl, result);
	}

	await fs.writeFile(svgPath, result, "utf8");
	return svgUrl;
}
