import Gun from 'gun/gun';
import GithubRepository from '../services/github/GithubRepository';
import reposWhitelist from './reposWhitelist.json';

export const gun = new Gun({
  peers: ['https://gun.mktcode.uber.space/gun'],
}).get('openq');

const GithubRepositoryClient = new GithubRepository();

export async function syncRepoWithGithub(ownerAndRepo) {
  const [owner, name] = ownerAndRepo.split('/').map((str) => str.trim());

  const githubRepoWithLabeledIssues = await GithubRepositoryClient.fetchRepoWithLabeledIssues(owner, name, [
    'good first issue',
  ]);

  const repo = {
    id: githubRepoWithLabeledIssues.id,
    owner,
    name,
    description: githubRepoWithLabeledIssues.description || '',
    url: githubRepoWithLabeledIssues.url,
    language: githubRepoWithLabeledIssues.languages.edges[0]?.node.name || '',
    stars: githubRepoWithLabeledIssues.stargazerCount,
    lastSynced: new Date().getTime(),
    issuesCount: githubRepoWithLabeledIssues.issues.nodes.length,
    issuesJson: JSON.stringify(
      githubRepoWithLabeledIssues.issues.nodes.map((issue) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        url: issue.url,
        assignee: issue.assignee?.login || '',
        comments: issue.comments.totalCount,
        labels: issue.labels.nodes,
      }))
    ),
  };

  gun.get(ownerAndRepo).put(repo);
}

const shuffledReposWhitelist = reposWhitelist.sort(() => 0.5 - Math.random());
shuffledReposWhitelist.slice(0, 10).forEach((repo) => syncRepoWithGithub(repo));
