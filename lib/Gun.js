import Gun from 'gun/gun';
import { Octokit } from 'octokit';
import reposWhitelist from './reposWhitelist.json';

export const gun = new Gun({
  peers: ['https://gun.mktcode.uber.space/gun'],
});

const octokit = new Octokit();

export async function syncRepoWithGithub(ownerAndRepo) {
  const [owner, name] = ownerAndRepo.split('/').map((str) => str.trim());

  const githubRepo = await octokit.request('GET /repos/{owner}/{repo}', { owner, repo: name });
  const githubIssues = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo: name,
    labels: 'good first issue',
  });

  const repo = {
    id: githubRepo.data.node_id,
    owner,
    name,
    description: githubRepo.data.description || '',
    url: githubRepo.data.html_url,
    language: githubRepo.data.language || '',
    stars: githubRepo.data.stargazers_count,
    lastSynced: new Date().getTime(),
    issuesCount: githubIssues.data.length,
    issuesJson: JSON.stringify(
      githubIssues.data.map((issue) => ({
        id: issue.node_id,
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        assignee: issue.assignee?.login || '',
        comments: issue.comments,
        labels: issue.labels,
      }))
    ),
  };

  gun.get(ownerAndRepo).put(repo);
}

const randomWhitelistedRepo = reposWhitelist[Math.floor(Math.random() * reposWhitelist.length)];
syncRepoWithGithub(randomWhitelistedRepo);
