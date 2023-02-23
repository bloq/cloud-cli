# cloud-cli

> ☁️ 💻

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cloud-cli.svg)](https://npmjs.org/package/cloud-cli)
[![Downloads/week](https://img.shields.io/npm/dw/cloud-cli.svg)](https://npmjs.org/package/cloud-cli)
[![License](https://img.shields.io/npm/l/cloud-cli.svg)](https://github.com/bloqpriv/cloud-cli/blob/master/package.json)

<!-- toc -->

- [cloud-cli](#cloud-cli)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @bloq/cloud-cli
$ bcl COMMAND
running command...
$ bcl (-v|--version|version)
@bloq/cloud-cli/3.2.0 darwin-x64 node-v14.17.6
$ bcl --help [COMMAND]
USAGE
  $ bcl COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`bcl client-keys OPERATION`](#bcl-client-keys-operation)
- [`bcl client-token`](#bcl-client-token)
- [`bcl clusters OPERATION`](#bcl-clusters-operation)
- [`bcl conf [KEY] [VALUE]`](#bcl-conf-key-value)
- [`bcl events`](#bcl-events)
- [`bcl help [COMMAND]`](#bcl-help-command)
- [`bcl login`](#bcl-login)
- [`bcl logout`](#bcl-logout)
- [`bcl nodes OPERATION`](#bcl-nodes-operation)
- [`bcl profile`](#bcl-profile)
- [`bcl signup`](#bcl-signup)
- [`bcl status`](#bcl-status)
- [`bcl update-password`](#bcl-update-password)
- [`bcl verify`](#bcl-verify)

## `bcl client-keys OPERATION`

Manage your Bloq client key(s)

```
USAGE
  $ bcl client-keys OPERATION

ARGUMENTS
  OPERATION  (create|list|remove) [default: list] Specify the type of client-keys operation to run

OPTIONS
  -i, --keyId=keyId  client key id, used with `remove` operation.
  -j, --json         JSON output
  -y, --yes          answer "yes" to prompts
```

_See code: [src/commands/client-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/client-keys.js)_

## `bcl client-token`

Generate new client token(s)

```
USAGE
  $ bcl client-token

OPTIONS
  -j, --json  JSON output
```

_See code: [src/commands/client-token.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/client-token.js)_

## `bcl clusters OPERATION`

Manage your Bloq clusters

```
USAGE
  $ bcl clusters OPERATION

ARGUMENTS
  OPERATION  (chains|create|disable-service|info|list|remove|services|update) [default: list] Specify the type of
             cluster operation to run

OPTIONS
  -A, --allClusters                list all clusters from every user (admins only)
  -F, --force                      force remove cluster from any user (admins only)
  -S, --sort=sort                  results sorting key
  -a, --all                        list all clusters, started and stopped
  -c, --capacity=capacity          [default: 2] capacity
  -i, --clusterId=clusterId        cluster id
  -j, --json                       JSON output
  -l, --alias=alias                set or update cluster alias
  -s, --serviceId=serviceId        service id
  -t, --authType=(jwt|basic|none)  [default: basic] auth type: jwt, basic or none
  -y, --yes                        answer "yes" to prompts
  --abort                          Abort an (update) operation
```

_See code: [src/commands/clusters.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/clusters.js)_

## `bcl conf [KEY] [VALUE]`

manage configuration

```
USAGE
  $ bcl conf [KEY] [VALUE]

ARGUMENTS
  KEY    key of the config
  VALUE  value of the config

OPTIONS
  -d, --cwd=cwd          config file location
  -d, --delete           delete?
  -h, --help             show CLI help
  -k, --key=key          key of the config
  -n, --name=name        config file name
  -p, --project=project  project name
  -v, --value=value      value of the config
```

_See code: [conf-cli](https://github.com/natzcam/conf-cli/blob/v0.1.9/src/commands/conf.ts)_

## `bcl events`

Get Bloq daily events

```
USAGE
  $ bcl events

OPTIONS
  -j, --json             JSON output
  -s, --service=service  service name
```

_See code: [src/commands/events.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/events.js)_

## `bcl help [COMMAND]`

Display help for bcl.

```
USAGE
  $ bcl help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

OPTIONS
  -n, --nested-commands  Include all nested commands in the output.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `bcl login`

Login to your Bloq account

```
USAGE
  $ bcl login

OPTIONS
  -j, --json               JSON output
  -p, --password=password  password
  -u, --user=user          email address or account id
```

_See code: [src/commands/login.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/login.js)_

## `bcl logout`

Clear local user data

```
USAGE
  $ bcl logout

OPTIONS
  -j, --json  JSON output
  -y, --yes   answer "yes" to prompts
```

_See code: [src/commands/logout.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/logout.js)_

## `bcl nodes OPERATION`

Manage your Bloq nodes

```
USAGE
  $ bcl nodes OPERATION

ARGUMENTS
  OPERATION  (create|list|remove|info|logs|chains|services) [default: list] Specify the type of nodes operation to run

OPTIONS
  -a, --all                   list all nodes
  -i, --nodeId=nodeId         node id
  -j, --json                  JSON output
  -l, --lines=lines           max lines to retrieve
  -s, --serviceId=serviceId   service id
  -t, --authType=(jwt|basic)  [default: basic] auth type (jwt or basic)
  -y, --yes                   answer "yes" to prompts
```

_See code: [src/commands/nodes.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/nodes.js)_

## `bcl profile`

Retrieve user profile

```
USAGE
  $ bcl profile

OPTIONS
  -j, --json  JSON output
```

_See code: [src/commands/profile.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/profile.js)_

## `bcl signup`

Setup a new Bloq account

```
USAGE
  $ bcl signup
```

_See code: [src/commands/signup.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/signup.js)_

## `bcl status`

Get Bloq services status

```
USAGE
  $ bcl status

OPTIONS
  -j, --json  JSON output
```

_See code: [src/commands/status.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/status.js)_

## `bcl update-password`

Update user password

```
USAGE
  $ bcl update-password
```

_See code: [src/commands/update-password.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/update-password.js)_

## `bcl verify`

Verifies your Bloq account and complete signup process

```
USAGE
  $ bcl verify

OPTIONS
  -t, --token=token  verification token
  -u, --user=user    email address or account id
```

_See code: [src/commands/verify.js](https://github.com/bloqpriv/cloud-cli/blob/v3.2.0/src/commands/verify.js)_

<!-- commandsstop -->
