# GitHub Key Rotator

The GitHub Key Rotator (gkr) is a CLI tool to automate the process of rotating GitHub / GitHub Enterprise SSH keys.

## Quick start

- Make sure your computer has:

  - `node`: `>=12.0.0`
  - `npm`: `>=6.0.0`
  - `ssh-agent`, `ssh-keygen` & `ssh-add`

- [Create a GitHub personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

  - please do check the `admin:public_key` permision for the token

- Install the CLI:

  ```
  npm install -g github-key-rotator
  ```

- Generate the key with CLI

  ```sh
  gkr -e YOUR_EMAIL -t YOUR_GITHUB_ACCESS_TOKEN
  # more usage please see gkr --help
  ```

- Config your `~/.ssh/config` to have:

  ```sh
  ######Add this section only if you are on MacOS######
  Host *
    AddKeysToAgent yes
    UseKeychain yes
  #####################################################

  Host github.com                  # or your GitHub Enterprise Domain
    Hostname github.com            # or your GitHub Enterprise Domain
    IdentityFile ~/.ssh/github     # same as the arg of `--file -f` you pass to the CLI, default is `~/.ssh/github`
    IdentitiesOnly yes
  ```

## Development scripts

- `npm test`: run tests (currently only run linting)
- `npm run lint`: run lint & typecheck
- `npm run build`: build the cli for local
- `npm start`: dev with [`ts-node`](https://github.com/TypeStrong/ts-node)
