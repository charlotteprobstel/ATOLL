module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setUseGitIgnore(false);

  // Safely embed a JSON value inside a <script> tag.
  eleventyConfig.addFilter("dump", function (value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
