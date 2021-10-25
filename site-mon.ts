#!/usr/bin/env -S /usr/local/bin/deno run --allow-net --allow-env
// deno-language: ts

/*
 * <xbar.title>Site Monitor</xbar.title>
 * <xbar.version>v1.0</xbar.version>
 * <xbar.desc>Watch the a list of sites to make sure they are still available.</xbar.desc>
 * <xbar.author>Brad "adigitalmonk" Boudreau</xbar.author>
 * <xbar.dependencies>deno</xbar.dependencies>
 *
 * <xbar.var>string(VAR_SITES=""): Comma-separated list of sites to check.</xbar.var>
 */


const siteList = Deno.env.get("VAR_SITES") as string;

if (!siteList || siteList.length <= 0) {
    console.log("Site Monitor\n---\nMissing 'VAR_SITES' setting");
    Deno.exit();
}

const sites = siteList.split(",");

function normalizeSite(site: string): string {
    if (site.substr(0, 4) != 'http') {
        return 'https://' + site
    }
    return site;
}

const results: Record<string, boolean> = {};
let errors = 0;
for (const site of sites) {
    const result = await fetch(normalizeSite(site)).catch(_err => ({ status: 400 }));
    if (result.status !== 200) {
        errors += 1;
        results[site] = false;
    } else {
        results[site] = true;
    }
}

console.log(`Sites ${new Array(errors).fill("!").join("")}`);
console.log("---");
for (const [site, result] of Object.entries(results)) {
    console.log(`${site} | color=${result ? 'green' : 'red'}`)
}
