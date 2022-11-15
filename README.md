# OpenQ-Frontend 
 
## Boot Locally

If the work you are engaged in doesn't require the Fullstack, you can boot just the OpenQ-Frontend by following these instructions. We normally work on the 'staging' branch, so make sure have all latest changes from it and do your Pull Requests to 'staging' unless instructed otherwise.

Note: the instructions should work if you are using Mac OS, Linux, but if you are on Windows, make sure to be using (Windows Sublinux System (WSL))[https://learn.microsoft.com/en-us/windows/wsl/install]. 

### 1 Get a GitHub Personal Access Token (PAT)

You can get a GitHub Personal Access Token (PAT) [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

You will need to create the token with these scopes:

```bash
public_repo
read:org
read:user
```

### 2 Get the right .env variables

In the root of `OpenQ-Frontend`, create a `.env` file.
Copy the content from `.env.local-targeting-staging.sample` to `.env`.
This will ensure that you target the same environment as deployed on staging.openq.dev but with your Frontend booted locally.

### 3 Boot a Local Json Server

```bash
yarn json-server
```

### 4 Boot the App

```bash
yarn boot:local-targeting-staging
```

### 5 Access OpenQ on http://localhost:3000

## Contributing

### Linting

OpenQ-Frontend uses husky, prettier, and eslint to enforce code style and linting on commits. If you'd like to contribute, please install and enable the prettier and eslint extensions. If you'd rather not install these extensions, you can run `eslint --fix . ` from the OpenQ-Frontend root directory to fix all auto fixable formatting issues and alert you to any linting issues.
