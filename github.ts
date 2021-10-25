#!/usr/bin/env -S /usr/local/bin/deno run --allow-net --allow-env
// deno-language: ts

/*
 * <xbar.title>GitHub PR Monitor</xbar.title>
 * <xbar.version>v1.0</xbar.version>
 * <xbar.desc>Watch the PRs for a list of Repos</xbar.desc>
 * <xbar.author>Brad "adigitalmonk" Boudreau</xbar.author>
 * <xbar.dependencies>deno</xbar.dependencies>
 *
 * <xbar.var>string(VAR_GITHUB_PAT=""): Your GitHub PAT.</xbar.var>
 * <xbar.var>string(VAR_GITHUB_TITLE="PR Monitor?"): Title for this plugin</xbar.var>
 * <xbar.var>string(VAR_GITHUB_REPOS=""): GitHub Repos to check PRs.</xbar.var>
 */

const padToken = Deno.env.get("VAR_GITHUB_PAT") as string;
const githubRepos = Deno.env.get("VAR_GITHUB_REPOS") as string;

if (!padToken || padToken?.length < 1) {
  console.log("PR Monitor");
  console.log("---");
  console.log("No GitHub PAT, please configure in the plugin settings.");
  Deno.exit(0);
}

if (!githubRepos || githubRepos?.length < 1) {
  console.log("PR Monitor");
  console.log("---");
  console.log(
    "No GitHub repos provided, please configure in the plugin settings.",
  );
  Deno.exit(0);
}

interface SearchResponse {
  items: RepoItem[];
  // deno-lint-ignore camelcase
  total_count: number;
}

interface User {
  login: string;
}

interface Label {
  id: number;
  url: string;
  name: string;
  color: string;
}

interface RepoItem {
  url: string;
  state: string;
  draft: boolean;
  title: string;
  // deno-lint-ignore camelcase
  html_url: string;
  comments: number;
  assignee: User;
  user: User;
  labels: Label[];
}

// TODO: Build the initial repoPRs key structure using this repo list.
const repoList = githubRepos.trim().split(",");
const query = `state:open ${
  repoList.map((repo) => `repo:${repo}`).join(" ")
} type:pr`;

// const requestHeaders =

const res = await fetch(
  "https://api.github.com/search/issues?q=" + encodeURIComponent(query),
  {
    headers: {
      "User-Agent": "xbar GitHub Pull Request Checker",
      "Authorization": `Bearer ${padToken}`,
    },
  },
);

if (res.status !== 200) {
  console.log(`Check your PAT. Error: ${res.status} | color=red`);
  Deno.exit(0);
}

const responseBody: SearchResponse = await res.json();

const prs: Record<string, RepoItem[]> = {};
for (const repoItem of responseBody.items) {
  const repo = repoItem.url.split("/").splice(4, 2).join("/");
  const repoUrl = repoItem.html_url.split("/").splice(0, 5).join("/");
  const repoKey = repo + "|" + repoUrl;
  prs[repoKey] = prs[repoKey] || [];
  prs[repoKey].push(repoItem);
}

const formatLabel = (label: Label) =>
  `----${label.name} | color=#${label.color}`;

const TITLE_LEN_LIMIT = 30;
const truncateTitle = (title: string) =>
  title.length > TITLE_LEN_LIMIT
    ? title.slice(0, TITLE_LEN_LIMIT) + "..."
    : title;

console.log(
  `${Deno.env.get("VAR_GITHUB_TITLE")} (${responseBody.total_count})\n---`,
);
for (const [repoKey, repoPRs] of Object.entries(prs)) {
  const [repo, repoUrl] = repoKey.split("|");
  console.log(`(${repoPRs.length}) ${repo} | href=${repoUrl}`);
  for (const repoPR of repoPRs) {
    const titleColor = repoPR.draft ? "lightgray" : "white";
    console.log(
      `--${
        truncateTitle(repoPR.title)
      } | href=${repoPR.html_url} color=${titleColor}`,
    );
    if (repoPR.draft) {
      console.log("----In Draft");
    }
    console.log(`----Author: ${repoPR.user.login} | color=white
----Assigned To: ${
      repoPR.assignee ? repoPR.assignee.login : "Unassigned"
    } | color=white
----Comments: ${repoPR.comments} | color=white
----State: ${repoPR.state} | color=white`);

    if (repoPR.labels.length > 0) {
      const labels = repoPR.labels.map(formatLabel);
      console.log(labels.join("\n"));
    }
  }
}
