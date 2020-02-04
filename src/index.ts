#!/usr/bin/env node

import 'source-map-support/register';
import { promises as fs } from 'fs';
import os from 'os';
import shell from 'shelljs';
import { oneLine } from 'common-tags';
import axios from 'axios';
import argv from './argv';

interface Key {
  id: number;
  key: string;
  url: string;
  title: string;
  verified: boolean;
  created_at: string;
  read_only: boolean;
}

interface Args {
  email: string;
  passphrase: string;
  title: string;
  file: string;
  token: string;
  'api-url': string;
}

const main = async (args: Args): Promise<void> => {
  shell.set('-e');
  shell.set('-v');

  shell.exec(
    oneLine`
      ssh-keygen
        -q
        -t rsa
        -m PEM
        -b 4096
        -C '${args.email}'
        -N '${args.passphrase}'
        -f '${args.file}'
        2>/dev/null <<< y >/dev/null
    `,
  );
  shell.exec('eval "$(ssh-agent -s)"');

  if (os.platform() === 'darwin') {
    shell.exec(`ssh-add -K ${args.file}`);
  } else {
    shell.exec(`ssh-add ${args.file}`);
  }

  const githubRequest = axios.create({
    baseURL: `${args['api-url']}`,
    headers: {
      Authorization: `token ${args.token}`,
    },
  });

  const uploadKeysRes = await githubRequest.post('/user/keys', {
    title: args.title,
    key: await fs.readFile(`${args.file}.pub`, 'utf-8'),
  });

  const githubPublicKey: Key = uploadKeysRes.data;
  console.log(githubPublicKey);

  const listKeysRes = await githubRequest.get('/user/keys');
  await Promise.all(
    listKeysRes?.data
      ?.filter(
        (key: Key) => key.id !== githubPublicKey.id && key.title === args.title,
      )
      ?.map(async (key: Key) => githubRequest.delete(`/user/keys/${key.id}`)),
  );
};

main(argv as Args).catch((error): void => {
  console.error(error?.message);
  process.exitCode = 1;
});
