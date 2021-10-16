#!/usr/bin/env -S /usr/local/bin/deno run --allow-net --allow-env
// deno-language: ts

/*
 * <xbar.title>DigitalOcean Droplet Monitor</xbar.title>
 * <xbar.version>v1.0</xbar.version>
 * <xbar.desc>View basic status of Droplets</xbar.desc>
 * <xbar.author>Brad "adigitalmonk" Boudreau</xbar.author>
 * <xbar.dependencies>deno</xbar.dependencies>
 *
 * <xbar.var>string(VAR_DO_TOKEN=""): Your DigialOcean API Token.</xbar.var>
 */

const digitalOceanToken = Deno.env.get("VAR_DO_TOKEN");

if (!digitalOceanToken || digitalOceanToken.length < 1) {
  console.log("Missing `VAR_DO_TOKEN` | color=red");
  Deno.exit(0);
}

const headers = { Authorization: `Bearer ${digitalOceanToken}` };
const { droplets } = await fetch("https://api.digitalocean.com/v2/droplets", {
  headers,
}).then((response) => response.json());
const billing = await fetch(
  "https://api.digitalocean.com/v2/customers/my/balance",
  { headers },
).then((response) => response.json());

console.log(`Droplets (${droplets.length})
---
Usage: $${billing.month_to_date_usage}
--Balance: $${billing.account_balance} | color=white`);

for (const droplet of droplets) {
  console.log(
    `${droplet.name} | color=${
      droplet.status === "active" ? "green" : "red"
    } href=https://cloud.digitalocean.com/droplets/${droplet.id}
--${droplet.image.distribution} ${droplet.image.name} | color=white
--Memory: ${droplet.memory} | color=white
--vCPUs: ${droplet.vcpus} | color=white
--Disk: ${droplet.disk} | color=white`,
  );
  if (droplet.next_backup_window) {
    console.log(
      `--Next Backup: ${droplet.next_backup_window.start} | color=white`,
    );
  }
}
