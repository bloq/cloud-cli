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
@bloq/cloud-cli/3.1.0 darwin-x64 node-v14.17.6
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
  -i, --keyId=keyId  client key id, used by `remove` operation only
  -j, --json         retrieves the data in JSON format
```

_See code: [src/commands/client-keys.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/client-keys.js)_

## `bcl client-token`

Generate new client token(s)

```
USAGE
  $ bcl client-token

OPTIONS
  -j, --json         retrieves the data in JSON format

```

_See code: [src/commands/client-token.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/client-token.js)_

## `bcl clusters OPERATION`

Manage your Bloq clusters

```
USAGE
  $ bcl clusters OPERATION

ARGUMENTS
  OPERATION  (create|disable-service|info|list|remove|services|update) [default: list] Specify the type of cluster
             operation to run

OPTIONS
  -a, --all                                list all clusters, started and stopped
  -A, --allClusters                        list all clusters from every user (admins only)
  -c, --capacity=capacity                  [default: 2] capacity
  -F, --force                              force remove cluster from any user (admins only)
  -i, --clusterId=clusterId                cluster id
  -j, --json                               retrieves the data in JSON format
  -o, --onDemandCapacity=onDemandCapacity  on-demand capacity
  -s, --serviceId=serviceId                service id
  -S, --sort=sort                          results sorting key
  -t, --authType=(jwt|basic|none)          [default: basic] auth type: jwt, basic or none
  -y, --yes                                answer "yes" to prompts
  --abort                                  Abort an (update) operation
```

EXAMPLE

1. Know which service is the cluster to create from, pick its `id`:

```bash
$ bcl clusters services

chain      network  software                    performance  region        id
---------  -------  --------------------------  -----------  ------------  --------------------------------------------
algorand   mainnet  algorand-participation-2.6  standard     eu-central-1  service-a2827f0d-c159-5c84-83d2-4f782082517c
algorand   mainnet  algorand-participation-2.6  standard     us-east-1     service-49e1296f-58f3-5202-89e1-f196f0fc7581
algorand   mainnet  algorand-relay-2.6          standard     af-south-1    service-2a3a59ab-aae7-54a3-88dc-b985d4d3de04
eth        testnet  geth-1.9                    high         us-east-1     service-9fa6e67b-3110-56c7-bf54-943c24603655

```

2. Run the create command: `bcl clusters create -s service-a2827f0d-c159-5c84-83d2-4f782082517c`

```bash
ℹ Creating a new cluster from service service-9fa6e67b-3110-56c7-bf54-943c24603655.

✔ Initialized new cluster from service service-9fa6e67b-3110-56c7-bf54-943c24603655
    * ID:               cluster-74401735-eba3-46fa-8908-0000000000
    * Name:             cake-harvest-chronic
    * Alias:
    * Chain:            eth
    * Network:          testnet
    * Version:          geth-1.9
    * Performance:      high
    * Domain:           cake-harvest-chronic.bloqcloudcluster.com
    * Capacity:         2:2
    * Region:           us-east-1
    * State:            started
    * User:             xxxx
    * Password:         yyyy
```

_See code: [src/commands/clusters.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/clusters.js)_

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
  -j, --json             retrieves the data in JSON format
  -s, --service=service  service name
```

_See code: [src/commands/events.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/events.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `bcl login`

Login to your Bloq account

```
USAGE
  $ bcl login

OPTIONS
  -p, --password=password  password
  -u, --user=user          email address or account id
```

_See code: [src/commands/login.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/login.js)_

## `bcl logout`

Clear local user data

```
USAGE
  $ bcl logout
```

_See code: [src/commands/logout.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/logout.js)_

## `bcl nodes OPERATION`

Manage your Bloq nodes

```
USAGE
  $ bcl nodes OPERATION

ARGUMENTS
  OPERATION  (create|list|remove|info|chains|services) [default: list] Specify the type of nodes operation to run

OPTIONS
  -a, --all                   list all nodes
  -i, --nodeId=nodeId         node id
  -j, --json                  retrieves the data in JSON format
  -s, --serviceId=serviceId   service id
  -t, --authType=(jwt|basic)  [default: basic] auth type (jwt or basic)
  -y, --yes                   answer "yes" to prompts
```

EXAMPLE

1. Know which service is the node to create from, pick its `id`:

```bash
$ bcl nodes services

chain  network  software       performance  region     id
-----  -------  -------------  -----------  ---------  --------------------------------------------
btc    testnet  core-0.17      standard     us-east-1  service-3a78db51-de2d-5199-aa74-a4e0089cf913
eth    mainnet  geth-1.8       high         us-east-1  service-29c6d43a-3256-51c0-95e8-145ba3db2d37
eth    mainnet  geth-1.8       standard     us-east-1  service-4341ce4f-9fc9-594b-a70e-4a151b8df202
eth    mainnet  geth-1.9       high         us-east-1  service-e5616f94-2828-5178-a548-c4a861fb29e7
eth    mainnet  geth-1.9       standard     us-east-1  service-6c56ad66-d970-5296-84ce-94a8042b2a96

```

2. Run the node creation command: `bcl nodes create -s service-4341ce4f-9fc9-594b-a70e-4a151b8df202`

```bash
ℹ Initializing a new node from service service-4341ce4f-9fc9-594b-a70e-4a151b8df202

✔ Initialized new node from service service-4341ce4f-9fc9-594b-a70e-4a151b8df202
    * ID:               node-a9fc799a-771c-4121-bfb2-0000000
    * Chain:            eth
    * Network:          mainnet
    * Version:          geth-1.8
    * Performance:      standard
    * State:            started
    * IP:               44.204.125.130
    * User:             xxxxx
    * Password:         yyyyy
```

_See code: [src/commands/nodes.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/nodes.js)_

## `bcl profile`

Retrieve user profile

```
USAGE
  $ bcl profile

OPTIONS
  -j, --json                  retrieves the data in JSON format
```

_See code: [src/commands/profile.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/profile.js)_

## `bcl signup`

Setup a new Bloq account

```
USAGE
  $ bcl signup
```

_See code: [src/commands/signup.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/signup.js)_

## `bcl status`

Get Bloq services status

```
USAGE
  $ bcl status

OPTIONS
  -j, --json                  retrieves the data in JSON format
```

_See code: [src/commands/status.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/status.js)_

## `bcl update-password`

Update user password

```
USAGE
  $ bcl update-password
```

_See code: [src/commands/update-password.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/update-password.js)_

## `bcl verify`

Verifies your Bloq account and complete signup process

```
USAGE
  $ bcl verify

OPTIONS
  -t, --token=token  verification token
  -u, --user=user    email address or account id
```

_See code: [src/commands/verify.js](https://github.com/bloqpriv/cloud-cli/blob/v3.1.0/src/commands/verify.js)_

<!-- commandsstop -->
