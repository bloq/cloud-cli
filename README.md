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
@bloq/cloud-cli/2.2.1 darwin-x64 node-v10.15.3
$ bcl --help [COMMAND]
USAGE
  $ bcl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bcl client-keys OPERATION`](#bcl-client-keys-operation)
* [`bcl client-token`](#bcl-client-token)
* [`bcl conf [KEY] [VALUE]`](#bcl-conf-key-value)
* [`bcl connect METHOD`](#bcl-connect-method)
* [`bcl events`](#bcl-events)
* [`bcl help [COMMAND]`](#bcl-help-command)
* [`bcl login`](#bcl-login)
* [`bcl logout`](#bcl-logout)
* [`bcl profile`](#bcl-profile)
* [`bcl status`](#bcl-status)
* [`bcl user-keys OPERATION`](#bcl-user-keys-operation)

## `bcl client-keys OPERATION`

Manage your BloqCloud client key(s)

```
USAGE
  $ bcl client-keys OPERATION

ARGUMENTS
  OPERATION  (create|list|remove) [default: list] Specify the type of client-keys operation to run

OPTIONS
  -i, --clientId=clientId  client id
```

_See code: [src/commands/client-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/client-keys.js)_

## `bcl client-token`

Generate new client token(s)

```
USAGE
  $ bcl client-token
```

_See code: [src/commands/client-token.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/client-token.js)_

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

## `bcl connect METHOD`

Access Connect services through bcl

```
USAGE
  $ bcl connect METHOD

ARGUMENTS
  METHOD  (block|blocks|block-hash|raw-block|transaction|tx|raw-transaction|raw-tx) Specify the method to get from
          connect API

OPTIONS
  -a, --argument=argument  Specify the argument for the method
  -c, --chain=btc|bch      [default: btc] Specify the chain for the method
  -n, --network=mainnet    [default: mainnet] Specify the network for the method
```

_See code: [src/commands/connect.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/connect.js)_

## `bcl events`

Get BloqCloud daily events

```
USAGE
  $ bcl events

OPTIONS
  -s, --service=service  service name
```

_See code: [src/commands/events.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/events.js)_

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

Login to your BloqCloud account

```
USAGE
  $ bcl login

OPTIONS
  -p, --password=password  password
  -u, --user=user          email address or account id
```

_See code: [src/commands/login.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/login.js)_

## `bcl logout`

Clear local user data

```
USAGE
  $ bcl logout
```

_See code: [src/commands/logout.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/logout.js)_

## `bcl profile`

Retrieve user profile

```
USAGE
  $ bcl profile
```

_See code: [src/commands/profile.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/profile.js)_

## `bcl status`

Get BloqCloud services status

```
USAGE
  $ bcl status
```

_See code: [src/commands/status.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/status.js)_

## `bcl user-keys OPERATION`

Manage your BloqCloud user key(s)

```
USAGE
  $ bcl user-keys OPERATION

ARGUMENTS
  OPERATION  (create|list|remove|info) [default: list] Specify the type of user-keys operation to run

OPTIONS
  -i, --keyId=keyId   key id
  -t, --type=bit|pgp  key type
```

_See code: [src/commands/user-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v2.2.1/src/commands/user-keys.js)_
<!-- commandsstop -->
