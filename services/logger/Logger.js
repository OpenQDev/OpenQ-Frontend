import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_USER_BY_ID, GET_USER_BY_NAME, GET_ORG_BY_ID, GET_ORG_BY_NAME, GET_ISSUE, GET_ISSUE_BY_ID, GET_ISSUES_BY_ID, GET_ORGS_BY_ISSUES, GET_ORGS_BY_IDS, GET_USERS_BY_IDS } from './graphql/query';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';

class Logger {
	enabled;

	constructor(_enabled) {
		enabled = _enabled;
	}

	log(data) {
		const { id, message } = data;

		if (this.enabled) {
			console.log(`id: ${id}, message: ${message}`);
		}
	}

}

export default Logger;
