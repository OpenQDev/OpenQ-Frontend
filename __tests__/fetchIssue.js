import { expect } from "chai";
import IssueRepository from "../services/IssueRepository";

describe("IssueRepository Tests", function () {
    it("Should return an issue", async () => {
        const issueRepository = new IssueRepository();
        const response = await issueRepository.fetchIssue("mock id");
        console.log(response.data.organization);
        expect(response.data.organization.repository.issue.id).to.equal("MDU6SXNzdWU4NjA0MTQ3ODk=");
    });
});
