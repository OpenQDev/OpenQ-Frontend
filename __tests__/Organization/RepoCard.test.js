
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import RepoCard from '../../components/Organization/RepoCard';


describe('OrganizationMetadata', () => {


	const repositoryData = {
		'name': 'curl',
		'languages': [
			{
				'__typename': 'Language',
				'name': 'C',
				'color': '#555555'
			},
			{
				'__typename': 'Language',
				'name': 'CMake',
				'color': '#DA3434'
			},
			{
				'__typename': 'Language',
				'name': 'Shell',
				'color': '#89e051'
			},
			{
				'__typename': 'Language',
				'name': 'Perl',
				'color': '#0298c3'
			},
			{
				'__typename': 'Language',
				'name': 'Makefile',
				'color': '#427819'
			},
			{
				'__typename': 'Language',
				'name': 'Python',
				'color': '#3572A5'
			},
			{
				'__typename': 'Language',
				'name': 'Batchfile',
				'color': '#C1F12E'
			},
			{
				'__typename': 'Language',
				'name': 'DIGITAL Command Language',
				'color': null
			},
			{
				'__typename': 'Language',
				'name': 'Emacs Lisp',
				'color': '#c065db'
			},
			{
				'__typename': 'Language',
				'name': 'M4',
				'color': null
			}
		],
		'description': 'A command line tool and library for transferring data with URL syntax, supporting DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET and TFTP. libcurl offers a myriad of powerful features',
		'url': 'https://github.com/curl/curl'
	};


	it('should render Repo card', async () => {
		// ARRANGE
		render(<RepoCard repository={repositoryData} complete={true} />);

		// ASSERT
		expect(screen.getByRole('link', { name: 'curl' })).toBeInTheDocument();
		expect(screen.getByText('A command line tool and library for transferring data with URL syntax, supporting DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET and TFTP. libcurl offers a myriad of powerful features')).toBeInTheDocument();
		expect(screen.getByText('C')).toBeInTheDocument();

		// should not have null or undefined values
		const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
		expect(nullish).toHaveLength(0);


	});

});