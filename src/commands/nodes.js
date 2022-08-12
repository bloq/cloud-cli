'use strict'

const { Command, flags } = require('@oclif/command')

const config = require('../config')
const nodes = require('../nodes')

class NodesCommand extends Command {
  async run() {
    const { args, flags } = this.parse(NodesCommand)
    const accessToken = config.get('accessToken')

    switch (args.operation) {
      case 'create':
        return nodes.create({ accessToken, ...flags })

      case 'remove':
        return nodes.remove({ accessToken, ...flags })

      case 'info':
        return nodes.info({ accessToken, ...flags })

      case 'logs':
        return nodes.logs({ accessToken, ...flags })

      case 'chains':
        return nodes.chains(flags)

      case 'services':
        return nodes.services(flags)

      default:
        return nodes.list({ accessToken, ...flags })
    }
  }
}

NodesCommand.description = 'Manage your Bloq nodes'
NodesCommand.flags = {
  serviceId: flags.string({ char: 's', description: 'service id' }),
  authType: flags.enum({
    char: 't',
    description: 'auth type (jwt or basic)',
    default: 'basic',
    options: ['jwt', 'basic']
  }),
  all: flags.boolean({
    char: 'a',
    description: 'list all nodes',
    default: false,
    required: false
  }),
  json: flags.boolean({ char: 'j', description: 'JSON output' }),
  nodeId: flags.string({ char: 'i', description: 'node id' }),
  yes: flags.boolean({
    char: 'y',
    description: 'answer "yes" to prompts',
    default: false
  }),
  lines: flags.integer({ char: 'l', description: 'max lines to retrieve' })
}

NodesCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of nodes operation to run',
    default: 'list',
    options: ['create', 'list', 'remove', 'info', 'logs', 'chains', 'services']
  }
]

module.exports = NodesCommand
