import os from 'os';
import path from 'path';
import yargs from 'yargs';

const { argv } = yargs
  .alias('version', 'v')
  .alias('help', 'h')
  .alias('config', 'c')
  .config()
  .env()
  .option('email', {
    alias: 'e',
    demandOption: true,
    describe: 'Email in GitHub SSH key comment',
    requiresArg: true,
    type: 'string',
  })
  .option('token', {
    alias: 't',
    demandOption: true,
    describe: 'GitHub personal access token',
    requiresArg: true,
    type: 'string',
  })
  .option('api-url', {
    alias: 'u',
    describe: 'GitHub API URL',
    default: 'https://api.github.com',
    requiresArg: true,
    type: 'string',
  })
  .option('title', {
    alias: 'T',
    describe: 'GitHub SSH key title',
    default: 'github-key-rotator',
    requiresArg: true,
    type: 'string',
  })
  .option('passphrase', {
    alias: 'p',
    describe: 'SSH key passphrase',
    default: '',
    requiresArg: true,
    type: 'string',
  })
  .option('file', {
    alias: 'f',
    describe: 'SSH key file path',
    default: '~/.ssh/github',
    requiresArg: true,
    type: 'string',
  })
  .coerce('file', (file: string): string =>
    file[0] === '~' ? path.join(os.homedir(), file.slice(1)) : file,
  )
  .example('$0 -e eg@fake.co -t TOKEN', 'Basic usage')
  .example('$0 -c PATH_TO_CONFIG.json', 'Use with config file')
  .example(
    '$0 -e eg@fake.co -t TOKEN -u "https://github.company.com/api/v3"',
    'Use with GitHub Enterprise',
  );

export default argv;
