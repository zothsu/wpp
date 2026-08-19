#!/usr/bin/env node
/**
 * Splits a completed `astro build` output (dist/) into three upload-ready
 * folders, one per Hostinger subdomain:
 *
 *   deploy/main/      -> wildpear.school            (chooser homepage + about pages)
 *   deploy/enrolled/  -> enrolled.wildpear.school    (enrolled-student portal;
 *                                                     password-protect this
 *                                                     folder in hPanel)
 *
 * Usage:
 *   npm run build
 *   node scripts/split-deploy.mjs
 *
 * Then upload the contents of each deploy/<target>/ folder to the matching
 * subdomain's document root (e.g. via hPanel File Manager or FTP/SFTP).
 *
 * Set PARKING_MODE=true to ship the coming-soon placeholder (src/pages/coming-soon.astro)
 * as "/" on both subdomains instead of the full site - everything still needs
 * a normal `npm run build` first since that's what compiles coming-soon.astro.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(rootDir, "dist");
const deployDir = join(rootDir, "deploy");

if (!existsSync(distDir)) {
	console.error('dist/ not found - run "npm run build" first.');
	process.exit(1);
}

// Static assets and files with no portal-specific content: copied to every
// target so each subdomain is a fully self-contained deploy.
const sharedAssets = [
	"_astro",
	"favicon.svg",
	"favicon_io",
	"images",
	"scripts",
	".well-known",
	".htaccess",
];

// Page routes (dist/<route>/) duplicated onto every target - legal pages
// need to exist standalone on each subdomain since there are no cross-portal
// links between them.
const sharedPages = ["privacy", "terms", "attributions"];

const targets = {
	main: {
		domain: "wildpear.school",
		pages: ["enrollment-information", "our-approach", "who-we-are", "programs", "contact"],
		// The chooser homepage is dist/index.html itself, handled separately below.
	},
	enrolled: {
		domain: "enrolled.wildpear.school",
		pages: ["enrolled-students", "handbooks", "forms", "tuition", "resources"],
		rootPage: "enrolled-students",
		// Root-level static files (not under an /images or /_astro folder).
		files: ["form-enrolment-summer.pdf", "handbook-25-26-wp-family.pdf", "handbook-summer.pdf"],
	},
};

const parkingMode = process.env.PARKING_MODE === "true";

rmSync(deployDir, { recursive: true, force: true });

for (const [name, target] of Object.entries(targets)) {
	const outDir = join(deployDir, name);
	mkdirSync(outDir, { recursive: true });

	for (const asset of sharedAssets) {
		const src = join(distDir, asset);
		if (existsSync(src)) cpSync(src, join(outDir, asset), { recursive: true });
	}

	if (parkingMode) {
		const src = join(distDir, "coming-soon", "index.html");
		if (!existsSync(src)) {
			console.error('dist/coming-soon/ not found - is src/pages/coming-soon.astro missing?');
			process.exit(1);
		}
		cpSync(src, join(outDir, "index.html"));
		console.log(`deploy/${name}/  ->  ${target.domain}  (PARKING MODE - coming-soon page only)`);
		continue;
	}

	for (const file of target.files ?? []) {
		const src = join(distDir, file);
		if (existsSync(src)) cpSync(src, join(outDir, file));
	}

	for (const page of [...target.pages, ...sharedPages]) {
		const src = join(distDir, page);
		if (existsSync(src)) {
			cpSync(src, join(outDir, page), { recursive: true });
		} else {
			console.warn(`  ! expected route "${page}" not found in dist/, skipping`);
		}
	}

	if (target.rootPage) {
		// Make the portal's landing page double as the subdomain's own root "/".
		const src = join(distDir, target.rootPage, "index.html");
		if (existsSync(src)) cpSync(src, join(outDir, "index.html"));
	} else {
		// main: the chooser homepage is the root itself.
		cpSync(join(distDir, "index.html"), join(outDir, "index.html"));
	}

	console.log(`deploy/${name}/  ->  ${target.domain}`);
}

console.log("\nDone. Upload each deploy/<target>/ folder to the matching subdomain's document root.");
console.log("Remember to enable password protection on the enrolled.wildpear.school folder in hPanel.");
