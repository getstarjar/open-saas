const { 
    parseMarkdownFile,
    DEFAULT_PARSE_FRONT_MATTER 
} = require("@docusaurus/utils");

const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");

const DEFAULT_OPTIONS = {
    include: "**/*.{md,mdx}", // Extensions to include.
    ignore: [
        "**/node_modules/**"
    ],
    path: "docs", // Path to data on filesystem, relative to site dir.
    routeBasePath: "docs", // URL Route.
    onlyLogFailedAttempts: false,
    page: "/open-saas/showcase"
};

let articles = [];

module.exports = function(context, options) {
    
    // options takes precendence over DEFAULT_OPTIONS
    const pluginOptions = { ...DEFAULT_OPTIONS, ...options };

    return {
        name: "docusaurus-plugin-showcase",

        async loadContent() {
            const siteDir = context.siteDir;

            console.log("START: docusaurus-plugin-showcase");

            const docsFiles = await fg(
                path.join(
                    siteDir,
                    pluginOptions.path,
                    pluginOptions.include
                ),
                {
                    ignore: pluginOptions.ignore,
                }
            );

            for (const filePath of docsFiles) {
                await this.processMetadata(filePath, siteDir);
            }

            if (!fs.existsSync(siteDir + "/src/data")) {
                fs.mkdirSync(siteDir + "/src/data", { recursive: true });
            }

            fs.writeFile(
                siteDir + "/src/data/articles.json",
                JSON.stringify(articles, null, 2)
            );
        },

        async contentLoaded({ actions: { addRoute } }) {
            console.log("FINISHED: docusaurus-plugin-showcase");

            addRoute({
                path: pluginOptions.page,
                component: "@site/plugins/docusaurus-plugin-showcase/dist/pages/showcase",
                exact: true,
            });
        },

        async processMetadata(filePath, siteDir) {
            const fileStringPromise = fs.readFile(filePath, "utf-8");
            const contents = await fileStringPromise;
            
            const {
                frontMatter,
                content,
                contentTitle,
            } = await parseMarkdownFile({
                fileContent: contents,
                filePath,
                parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
            });

            let {
                missingTags,
                missingTitle,
                missingDescription,
                missingSlug,
            } = false;

            let article = {};

            // Check tags
            if (frontMatter["x-custom"]) {
                if (frontMatter["x-custom"]["hideInGuideShowcase"] == true) {
                    return;
                } else if (frontMatter["x-custom"]["tags"]) {
                    article.tags = frontMatter["x-custom"]["tags"];
                } else {
                    missingTags = true;
                }
            } else {
                missingTags = true;
            }

            // Check title
            if (frontMatter.title) {
                article.title = frontMatter.title;
            } else if (contentTitle) {
                article.title = contentTitle;
            } else {
                missingTitle = true;
            }

            let newExcerpt = this.createExcerptWithoutHeading(content);

            // Check description
            if (frontMatter.description) {
                article.description = frontMatter.description;
            } else if (newExcerpt) {
                article.description = newExcerpt;
            } else {
                missingDescription = true;
            }

            // Determine link
            if (frontMatter.slug) {
                article.website = frontMatter.slug;
            } else {
                let newPath = filePath
                    .replace(siteDir, "")
                    .replace(pluginOptions.path + "/", "")
                    .replace("/index.mdx", "")
                    .replace(".mdx", "")
                    .replace(".md", "");

                // If new path starts with /sdks/, add pathname:// at the start
                if (newPath.startsWith("/sdks/")) {
                    newPath = "pathname://" + newPath;
                }

                article.website = newPath;
            }

            // Check for custom repo
            if (frontMatter["x-custom"] && frontMatter["x-custom"]["repo"]) {
                article.source = frontMatter["x-custom"]["repo"];
            }

            if (missingTags || missingTitle || missingDescription) {
                this.logWithColor("red", "  ✘ " + filePath);
                missingTags ? this.logWithColor("red", "    - Tags: ✘") : "";
                missingTitle ? this.logWithColor("red", "    - Title: ✘") : "";
                missingDescription ? this.logWithColor("red", "    - Description: ✘") : "";
                return;
            } else {
                if (pluginOptions.onlyLogFailedAttempts) {
                    // Don't do anything
                } else {
                    this.logWithColor("green", "  ✔ " + filePath);
                }
                articles.push(article);
            }
        },

        logWithColor(color, text) {
            const reset = "\x1b[0m";
            let colorAscii = "\x1b[0m";

            if (color == 'green') {
                colorAscii = "\x1b[32m";
            } else if (color == 'red') {
                colorAscii = "\x1b[31m";
            }

            console.log(colorAscii + text + reset)
        },

        createExcerptWithoutHeading(articleContent) {
            // Split the text into paragraphs based on empty lines
            const paragraphs = articleContent.split(/\n\s*\n/);

            for (const paragraph of paragraphs) {
                // Check if the paragraph is not a heading (doesn't start with #, ##, ###, etc.)
                if (!/^#+\s/.test(paragraph)) {
                    const cleanedLine = paragraph
                        // Remove HTML tags.
                        .replace(/<[^>]*>/g, "")
                        // Remove Title headers
                        .replace(/^#[^#]+#?/gm, "")
                        // Remove Markdown + ATX-style headers
                        .replace(/^#{1,6}\s*(?<text>[^#]*)\s*#{0,6}/gm, "$1")
                        // Remove emphasis.
                        .replace(/(?<opening>[*_]{1,3})(?<text>.*?)\1/g, "$2")
                        // Remove strikethroughs.
                        .replace(/~~(?<text>\S.*\S)~~/g, "$1")
                        // Remove images.
                        .replace(/!\[(?<alt>.*?)\][[(].*?[\])]/g, "$1")
                        // Remove footnotes.
                        .replace(/\[\^.+?\](?:: .*$)?/g, "")
                        // Remove inline links.
                        .replace(/\[(?<alt>.*?)\][[(].*?[\])]/g, "$1")
                        // Remove inline code.
                        .replace(/`(?<text>.+?)`/g, "$1")
                        // Remove blockquotes.
                        .replace(/^\s{0,3}>\s?/g, "")
                        // Remove admonition definition.
                        .replace(/:::.*/, "")
                        // Remove Emoji names within colons include preceding whitespace.
                        .replace(/\s?:(?:::|[^:\n])+:/g, "")
                        // Remove custom Markdown heading id.
                        .replace(/\{#*[\w-]+\}/, "")
                        .trim();

                    return cleanedLine;
                }
            }

            if (cleanedLine) {
                return cleanedLine;
            } else {
                return "";
            }
        },
    };
};
