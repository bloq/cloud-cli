# cloud-cli

> ☁️ 💻

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cloud-cli.svg)](https://npmjs.org/package/cloud-cli)
[![Downloads/week](https://img.shields.io/npm/dw/cloud-cli.svg)](https://npmjs.org/package/cloud-cli)
[![License](https://img.shields.io/npm/l/cloud-cli.svg)](https://github.com/bloqpriv/cloud-cli/blob/master/package.json)

<!-- toc -->
* [cloud-cli](#cloud-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @bloq/cloud-cli
$ bcl COMMAND
running command...
$ bcl (--version)
@bloq/cloud-cli/2.8.0 darwin-x64 node-v14.17.6
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
* [`bcl clusters OPERATION`](#bcl-clusters-operation)
* [`bcl conf [KEY] [VALUE]`](#bcl-conf-key-value)
* [`bcl connect METHOD`](#bcl-connect-method)
* [`bcl events`](#bcl-events)
* [`bcl help [COMMAND]`](#bcl-help-command)
* [`bcl login`](#bcl-login)
* [`bcl logout`](#bcl-logout)
* [`bcl nodes OPERATION`](#bcl-nodes-operation)
* [`bcl profile`](#bcl-profile)
* [`bcl signup`](#bcl-signup)
* [`bcl status`](#bcl-status)
* [`bcl update-password`](#bcl-update-password)
* [`bcl user-keys OPERATION`](#bcl-user-keys-operation)
* [`bcl verify`](#bcl-verify)

## `bcl client-keys OPERATION`

Manage your Bloq client key(s)

```
USAGE
  $ bcl client-keys [OPERATION] [-i <value>]

ARGUMENTS
  OPERATION  (create|list|remove) [default: list] Specify the type of client-keys operation to run

FLAGS
  -i, --clientId=<value>  client id

DESCRIPTION
  Manage your Bloq client key(s)
```

_See code: [src/commands/client-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/client-keys.js)_

## `bcl client-token`

Generate new client token(s)

```
USAGE
  $ bcl client-token

DESCRIPTION
  Generate new client token(s)
```

_See code: [src/commands/client-token.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/client-token.js)_

## `bcl clusters OPERATION`

Manage your Bloq clusters

```
USAGE
  $ bcl clusters [OPERATION] [-s <value>] [-t jwt|basic|none] [-c <value>] [-o <value>] [-a] [-y] [-i <value>]
    [-S <value>] [-j] [--abort]

ARGUMENTS
  OPERATION  (create|disable-service|info|list|remove|services|update) [default: list] Specify the type of cluster
             operation to run

FLAGS
  -S, --sort=<value>               results sorting key
  -a, --all                        list all clusters
  -c, --capacity=<value>           [default: 2] capacity
  -i, --clusterId=<value>          cluster id
  -j, --json                       JSON output
  -o, --onDemandCapacity=<value>   [default: 1] on-demand capacity
  -s, --serviceId=<value>          service id
  -t, --authType=(jwt|basic|none)  [default: basic] auth type: jwt, basic or none
  -y, --yes                        answer "yes" to prompts
  --abort                          Abort an (update) operation

DESCRIPTION
  Manage your Bloq clusters
```

_See code: [src/commands/clusters.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/clusters.js)_

## `bcl conf [KEY] [VALUE]`

manage configuration

```
USAGE
  $ bcl conf [KEY] [VALUE] [-h] [-k <value>] [-v <value>] [-d] [-p <value>] [-n <value>] [-d <value>]

ARGUMENTS
  KEY    key of the config
  VALUE  value of the config

FLAGS
  -d, --cwd=<value>      config file location
  -d, --delete           delete?
  -h, --help             show CLI help
  -k, --key=<value>      key of the config
  -n, --name=<value>     config file name
  -p, --project=<value>  project name
  -v, --value=<value>    value of the config

DESCRIPTION
  manage configuration
```

_See code: [conf-cli](https://github.com/natzcam/conf-cli/blob/v0.1.8/src/commands/conf.ts)_

## `bcl connect METHOD`

Access Connect services through bcl

```
USAGE
  $ bcl connect [METHOD] [-a <value>] [-c btc|bch] [-n mainnet]

ARGUMENTS
  METHOD  (block|blocks|block-hash|raw-block|transaction|tx|raw-transaction|raw-tx) Specify the method to get from
          connect API

FLAGS
  -a, --argument=<value>  Specify the argument for the method
  -c, --chain=<option>    [default: btc] Specify the chain for the method
                          <options: btc|bch>
  -n, --network=<option>  [default: mainnet] Specify the network for the method
                          <options: mainnet>

DESCRIPTION
  Access Connect services through bcl
```

_See code: [src/commands/connect.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/connect.js)_

## `bcl events`

Get Bloq daily events

```
USAGE
  $ bcl events [-s <value>]

FLAGS
  -s, --service=<value>  service name

DESCRIPTION
  Get Bloq daily events
```

_See code: [src/commands/events.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/events.js)_

## `bcl help [COMMAND]`

Display help for bcl.

```
USAGE
  $ bcl help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bcl.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `bcl login`

Login to your Bloq account

```
USAGE
  $ bcl login [-u <value>] [-p <value>]

FLAGS
  -p, --password=<value>  password
  -u, --user=<value>      email address or account id

DESCRIPTION
  Login to your Bloq account
```

_See code: [src/commands/login.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/login.js)_

## `bcl logout`

Clear local user data

```
USAGE
  $ bcl logout

DESCRIPTION
  Clear local user data
```

_See code: [src/commands/logout.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/logout.js)_

## `bcl nodes OPERATION`

Manage your Bloq nodes

```
USAGE
  $ bcl nodes [OPERATION] [-s <value>] [-t jwt|basic] [-a] [-i <value>]

ARGUMENTS
  OPERATION  (create|list|remove|info|chains|services) [default: list] Specify the type of nodes operation to run

FLAGS
  -a, --all                   list all nodes
  -i, --nodeId=<value>        node id
  -s, --serviceId=<value>     service id
  -t, --authType=(jwt|basic)  [default: basic] auth type (jwt or basic)

DESCRIPTION
  Manage your Bloq nodes
```

_See code: [src/commands/nodes.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/nodes.js)_

## `bcl profile`

Retrieve user profile

```
USAGE
  $ bcl profile

DESCRIPTION
  Retrieve user profile
```

_See code: [src/commands/profile.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/profile.js)_

## `bcl signup`

Setup a new Bloq account

```
USAGE
  $ bcl signup

DESCRIPTION
  Setup a new Bloq account
```

_See code: [src/commands/signup.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/signup.js)_

## `bcl status`

Get Bloq services status

```
USAGE
  $ bcl status

DESCRIPTION
  Get Bloq services status
```

_See code: [src/commands/status.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/status.js)_

## `bcl update-password`

Update user password

```
USAGE
  $ bcl update-password

DESCRIPTION
  Update user password
```

_See code: [src/commands/update-password.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/update-password.js)_

## `bcl user-keys OPERATION`

Manage your Bloq user key(s)

```
USAGE
  $ bcl user-keys [OPERATION] [-t bit|pgp] [-i <value>]

ARGUMENTS
  OPERATION  (create|list|remove|info) [default: list] Specify the type of user-keys operation to run

FLAGS
  -i, --keyId=<value>  key id
  -t, --type=<option>  key type
                       <options: bit|pgp>

DESCRIPTION
  Manage your Bloq user key(s)
```

_See code: [src/commands/user-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/user-keys.js)_

## `bcl verify`

Verifies your Bloq account and complete signup process

```
USAGE
  $ bcl verify [-u <value>] [-t <value>]

FLAGS
  -t, --token=<value>  verification token
  -u, --user=<value>   email address or account id

DESCRIPTION
  Verifies your Bloq account and complete signup process
```

_See code: [src/commands/verify.js](https://github.com/bloqpriv/cloud-cli/blob/v2.8.0/src/commands/verify.js)_
<!-- commandsstop -->
