import type { NextConfig } from "next";
import path from "node:path";

// Deploys to GitHub Pages as a project site (cognisivelabs.github.io/cakelake).
// basePath/assetPrefix are only needed there — leave GITHUB_PAGES unset for
// local dev and for a future move to a custom domain or AWS (ADR-002).
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "cakelake";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // next/image's optimizer needs a server; static export has none.
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  // Pins the workspace root to this directory — otherwise Turbopack walks
  // up looking for a lockfile and can pick up an unrelated one outside
  // the repo (e.g. in a parent directory).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
