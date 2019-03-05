cloud-cli
=========

> ☁️ 💻

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cloud-cli.svg)](https://npmjs.org/package/cloud-cli)
[![Downloads/week](https://img.shields.io/npm/dw/cloud-cli.svg)](https://npmjs.org/package/cloud-cli)
[![License](https://img.shields.io/npm/l/cloud-cli.svg)](https://github.com/bloqpriv/cloud-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @bloq/cloud-cli
$ bcl COMMAND
running command...
$ bcl (-v|--version|version)
@bloq/cloud-cli/0.0.2 darwin-x64 node-v8.9.4
$ bcl --help [COMMAND]
USAGE
  $ bcl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bcl cc`](#bcl-cc)
* [`bcl client-keys OPERATION`](#bcl-client-keys-operation)
* [`bcl client-token`](#bcl-client-token)
* [`bcl conf [KEY] [VALUE]`](#bcl-conf-key-value)
* [`bcl events`](#bcl-events)
* [`bcl help [COMMAND]`](#bcl-help-command)
* [`bcl login`](#bcl-login)
* [`bcl logout`](#bcl-logout)
* [`bcl nodes OPERATION`](#bcl-nodes-operation)
* [`bcl profile`](#bcl-profile)
* [`bcl signup`](#bcl-signup)
* [`bcl status`](#bcl-status)
* [`bcl update-password`](#bcl-update-password)
* [`bcl verify`](#bcl-verify)

## `bcl cc`

setup your credit card information

```
USAGE
  $ bcl cc
```

_See code: [src/commands/cc.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/cc.js)_

## `bcl client-keys OPERATION`

Manage your bloq cloud client keys.

```
USAGE
  $ bcl client-keys OPERATION

ARGUMENTS
  OPERATION  (create|list|remove) [default: list] Specify the kind of client-keys operation to run
```

_See code: [src/commands/client-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/client-keys.js)_

## `bcl client-token`

generates a new client tokens.

```
USAGE
  $ bcl client-token
```

_See code: [src/commands/client-token.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/client-token.js)_

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

_See code: [conf-cli](https://github.com/natzcam/conf-cli/blob/v0.1.8/src/commands/conf.ts)_

## `bcl events`

gets bloq cloud events

```
USAGE
  $ bcl events
```

_See code: [src/commands/events.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/events.js)_

## `bcl help [COMMAND]`

display help for bcl

```
USAGE
  $ bcl help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `bcl login`

logins you with your bloq-cloud account.

```
USAGE
  $ bcl login

OPTIONS
  -u, --user=user  account id or email
```

_See code: [src/commands/login.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/login.js)_

## `bcl logout`

Clear local user data

```
USAGE
  $ bcl logout
```

_See code: [src/commands/logout.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/logout.js)_

## `bcl nodes OPERATION`

Manage your bloq cloud nodes.

```
USAGE
  $ bcl nodes OPERATION

ARGUMENTS
  OPERATION  (create|list|remove|get) [default: list] Specify the kind of nodes operation to run

OPTIONS
  -a, --all        list all nodes
  -c, --chain=btc  chain type
```

_See code: [src/commands/nodes.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/nodes.js)_

## `bcl profile`

gets user profile.

```
USAGE
  $ bcl profile
```

_See code: [src/commands/profile.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/profile.js)_

## `bcl signup`

setup a new bloqcloud account

```
USAGE
  $ bcl signup
```

_See code: [src/commands/signup.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/signup.js)_

## `bcl status`

Get bloq cloud services status

```
USAGE
  $ bcl status
```

_See code: [src/commands/status.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/status.js)_

## `bcl update-password`

updates user password.

```
USAGE
  $ bcl update-password
```

_See code: [src/commands/update-password.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/update-password.js)_

## `bcl verify`

verifies your account and finish signup process

```
USAGE
  $ bcl verify
```

_See code: [src/commands/verify.js](https://github.com/bloqpriv/cloud-cli/blob/v0.0.2/src/commands/verify.js)_
<!-- commandsstop -->
