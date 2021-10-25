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
  if (site.substr(0, 4) != "http") {
    return "https://" + site;
  }
  return site;
}

const greens: string[] = [];
const reds: string[] = [];
for (const site of sites) {
  const result = await fetch(normalizeSite(site)).catch((_err) => ({
    status: 400,
  }));

  if (result.status < 300 && result.status >= 200) {
    greens.push(site);
  } else {
    reds.push(site);
  }
}

console.log(`Sites ${new Array(reds.length).fill("!").join("")}`);
console.log("---");
for (const redSite of reds) {
  console.log(`${redSite} | color=red`);
}
for (const greenSite of greens) {
  console.log(`${greenSite} | color=green`);
}
