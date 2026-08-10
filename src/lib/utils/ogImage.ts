import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Resolved from the project root (not import.meta.url) because Astro bundles
// this module into dist/.prerender/chunks/ at build time, which would
// otherwise point the cache at a nonexistent path under dist/ and abort the
// build with ENOENT.
const CACHE_PATH = join(process.cwd(), "src/data/og-image-cache.json");

interface CacheEntry {
	image: string | null;
	fetchedAt: string;
}

type Cache = Record<string, CacheEntry>;

let cache: Cache | null = null;

function loadCache(): Cache {
	if (cache) return cache;

	let loaded: Cache = {};
	if (existsSync(CACHE_PATH)) {
		try {
			loaded = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
		} catch {
			loaded = {};
		}
	}

	cache = loaded;
	return cache;
}

function persistCache() {
	if (cache) writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
}

function extractOgImage(html: string, baseUrl: string): string | null {
	const patterns = [
		/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
		/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
		/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
		/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
	];

	for (const pattern of patterns) {
		const match = html.match(pattern);
		if (match?.[1]) {
			try {
				return new URL(match[1], baseUrl).href;
			} catch {
				continue;
			}
		}
	}

	return null;
}

/**
 * Fetches a page's og:image (falling back to twitter:image) at build time,
 * caching results to src/data/og-image-cache.json so repeat builds/dev
 * reloads don't re-fetch every external site. Returns null (never throws)
 * when the page can't be fetched or has no image meta tag - callers should
 * fall back to a placeholder.
 */
export async function getOgImage(url: string): Promise<string | null> {
	const c = loadCache();
	if (c[url]) return c[url].image;

	let image: string | null = null;
	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; WildPearPreschoolBot/1.0)",
				Accept: "text/html",
			},
			signal: AbortSignal.timeout(8000),
		});
		if (response.ok) {
			image = extractOgImage(await response.text(), url);
		}
	} catch {
		image = null;
	}

	c[url] = { image, fetchedAt: new Date().toISOString() };
	persistCache();
	return image;
}
