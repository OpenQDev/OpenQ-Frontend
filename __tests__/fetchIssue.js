import { expect } from 'chai';
import GithubRepository from '../services/GithubRepository/GithubRepository';

describe('GithubRepository Tests', function () {
	it('Should return an issue', async () => {
		const githubRepository = new GithubRepository();
		const response = await githubRepository.fetchIssue('mock id');
		console.log(response.data.organization);
		expect(response.data.organization.repository.issue.id).to.equal('MDU6SXNzdWU4NjA0MTQ3ODk=');
	});
});
