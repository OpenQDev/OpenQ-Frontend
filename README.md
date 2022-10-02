# OpenQ-Frontend 
 
## Boot Locally

If the work you are engaged in doesn't require the Fullstack, you can boot just the OpenQ-Frontend by following these instructions:

### 1 Boot a Local Json Server

```bash
yarn json-server
```

### 2 Boot the App

```bash
yarn boot:local
```

### 3 Access OpenQ on http://localhost:3000

## Contributing

### Linting

OpenQ-Frontend uses husky, prettier, and eslint to enforce code style and linting on commits. If you'd like to contribute, please install and enable the prettier and eslint extensions. If you'd rather not install these extensions, you can run `eslint --fix . ` from the OpenQ-Frontend root directory to fix all auto fixable formatting issues and alert you to any linting issues.