/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: builds to a plain HTML/CSS/JS folder (./out) that
  // GitHub Pages can serve directly, no server required.
  output: "export",
  // Project pages on GitHub Pages (username.github.io/REPO-NAME) are
  // served from a subpath, not the domain root — this prefixes all asset
  // links accordingly, but ONLY when explicitly building for that target
  // (GH_PAGES_BUILD=1). Plain `npm run dev` / `npm run build` locally stay
  // at the root path, so local preview always just works. Once a custom
  // domain is attached later, this won't be needed at all (custom domains
  // serve from the root, same as local).
  basePath: process.env.GH_PAGES_BUILD ? "/UAAD-website" : "",
  images: {
    // next/image's optimization API needs a server; not used here since
    // this project renders cover images with plain <img> tags anyway.
    unoptimized: true,
  },
};

module.exports = nextConfig;
