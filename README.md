# xBar Scripts

A collection of simple xbar scripts.

## Installation

Ensure that you have deno installed. You can get Deno here:
<https://deno.land/#installation>

You might need to ensure that the `shebang` at the top of the scripts is
accurate to your current install path for deno.

```
#!/usr/bin/env -S deno run --allow-net --allow-env
// vs.
#!/usr/bin/env -S /opt/homebrew/bin/deno run --allow-net --allow-env
```

Make sure the scripts are executable:

```
> chmod +x github.ts
> chmod +x droplets.ts
```

Then symlink the desired script into
`~/Library/Application Support/xbarapp/plugins`:

```
> ln -s /path/to/this/project/github.ts ~/Library/Application\ Support/xbarapp/plugins/github.1h.ts
> ln -s /path/to/this/project/droplets.ts ~/Library/Application\ Support/xbarapp/plugins/droplets.1d.ts
```

## Git PR Monitor

Simple PR monitoring plugin for [xbarapp](https://xbarapp.com).

You'll need a
[GitHub Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token),
added to the configuration.

The xbar variables are:

- GitHub PAT
- Repo List (A comma separated list of repos to list the PRs for)
  - E.g., `adigitalmonk/xbar-scripts,matryer/xbar`

## Droplet Monitor

To use this script you'll need a DigitalOcean API Token with the "Read" scope.

- <https://docs.digitalocean.com/reference/api/create-personal-access-token/>

The xbar variables are:

- DigitalOcean API Token

### Limitations

- Currently, this only lists the first 20 droplets in your account.

## Direct Usage

You can use these script outside of xbar as well. When running the script,
ensure that the environment variable `VAR_GITHUB_PAT` is set.

You can run it via Deno.

```
> deno run --allow-net --allow-env github.ts
> deno run --allow-net --allow-env droplets.ts
```

Or directly on the command line.

```
> ./github.ts
> ./droplets.ts
```
