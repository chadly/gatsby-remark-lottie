# Gatsby Lottie Transformer Plugin

> A [Gatsby](https://github.com/gatsbyjs/gatsby) remark plugin to embed [Lottie JSON animations](https://github.com/airbnb/lottie-web) with SVG placeholders in your Markdown/MDX.

## Usage

```
npm install gatsby-remark-lottie
```

In `gatsby-config.js`:

```js
module.exports = {
  plugins:[{
    resolve: "gatsby-transformer-remark",
      options: {
        plugins: ["gatsby-transformer-lottie"]
      }
  }]
};
```

or if you are using [MDX](https://www.gatsbyjs.org/packages/gatsby-plugin-mdx/):

```js
module.exports = {
  plugins:[{
    resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: ["gatsby-transformer-lottie"]
      }
  }]
};
```

Then in your markdown/MDX:

```markdown
Hi here is a cool animation:

![alt text](myanimation.json)
```

This assumes a `myanimation.json` lives next to your markdown/MDX file. The image will then be rendered as an animated SVG with a static SVG placeholder for clients with scripts disabled.

If you need some inspiration for JSON animation files, check out [Lottie Files](https://lottiefiles.com/).

### Options

The plugin takes a number of options that are shown here with their default values:

```js
module.exports = {
  plugins:[{
    resolve: "gatsby-transformer-remark",
      options: {
        plugins: [{
          resolve: "gatsby-remark-lottie",
          options: {
            // Whether or not to generate static SVG placeholders.
            // If this is false, an empty div will render until
            // the lottie script starts the animation.
            generatePlaceholders: true,

            // lottie-web is loaded from CDN to start the animations.
            // This controls which version of the script is loaded.
            lottieVersion: "5.7.1",

            // The renderer to use (html, canvas, or svg). The static
            // placeholder will always be an SVG despite this value.
            // See the lottie-web docs: https://github.com/airbnb/lottie-web#html
            renderer: "svg",

            // Whether or not to loop the animation.
            // See the lottie-web docs: https://github.com/airbnb/lottie-web#html
            loop: true,

            // Whether or not to autoplay the animation on load.
            // See the lottie-web docs: https://github.com/airbnb/lottie-web#html
            autoplay: true
          }
        }]
      }
  }]
};
```

You can also pass [`rendererSettings`](https://github.com/airbnb/lottie-web#other-loading-options) to control lottie-web during the generation of the static placeholder SVG.

## How It Works

This plugin makes use of [lottie-to-svg](https://github.com/chadly/lottie-to-svg) to render the first frame of a lottie animation to an SVG which it then places into your HTML. When the page is loaded, the lottie script is [loaded from CDN](https://cdnjs.com/libraries/bodymovin) to replace the placeholder with the animation.

Based on the renderer you choose in the plugin's options, only the streamlined script for that renderer will be loaded. e.g. if you choose `svg` as your renderer, the `lottie_svg.min.js` file will be loaded.
