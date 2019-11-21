'use strict'

const { Command, flags } = require('@oclif/command')

const config = require('../config')
const clusters = require('../clusters')

class ClusterCommand extends Command {
  async run () {
    const { args, flags } = this.parse(ClusterCommand)
    const accessToken = config.get('accessToken')

    switch (args.operation) {
      case 'create':
        return clusters.create({ accessToken, ...flags })

      case 'remove':
        return clusters.remove({ accessToken, ...flags })

      case 'info':
        return clusters.info({ accessToken, ...flags })

      case 'services':
        return clusters.services()

      default:
        return clusters.list({ accessToken, ...flags })
    }
  }
}

ClusterCommand.description = 'Manage your BloqCloud clusters'
ClusterCommand.flags = {
  serviceId: flags.string({ char: 's', description: 'service id' }),
  authType: flags.enum({
    char: 't',
    description: 'auth type (jwt or basic)',
    default: 'basic',
    options: ['jwt', 'basic']
  }),
  all: flags.boolean({
    char: 'a',
    description: 'list all clusters',
    default: false,
    required: false
  }),
  clusterId: flags.string({ char: 'i', description: 'cluster id' })
}

ClusterCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of cluster operation to run',
    default: 'list',
    options: ['create', 'list', 'remove', 'info', 'chains', 'services']
  }
]

module.exports = ClusterCommand
