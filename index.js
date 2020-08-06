const path = require("path");
const fs = require("fs").promises;

const visit = require("unist-util-visit");
const renderToSvg = require("lottie-to-svg");

const isLottieAnimation = node =>
	node.type === "image" && node.url.endsWith(".json");

let rootDir = path.dirname(require.main.filename);
if (rootDir.endsWith(".cache")) {
	rootDir = path.resolve(path.join(rootDir, ".."));
}
const assetPath = path.join(rootDir, "public");

module.exports = async ({ markdownAST }, pluginOptions) => {
	const nodes = [];
	visit(markdownAST, "image", node => {
		if (isLottieAnimation(node)) {
			nodes.push(node);
		}
	});

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[0];

		const lottiePath = path.join(assetPath, node.url);
		const jsonContent = await fs.readFile(lottiePath, "utf8");
		const animationData = JSON.parse(jsonContent);

		const svgPreview = await renderToSvg(animationData, pluginOptions);

		node.type = "html";
		node.value = `<div class="lottie" data-animation-path="${node.url}">${svgPreview}</div>`;
		node.children = null;
	}

	return markdownAST;
};
