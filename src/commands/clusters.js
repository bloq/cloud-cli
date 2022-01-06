'use strict'

const { Command, flags } = require('@oclif/command')

const config = require('../config')
const clusters = require('../clusters')

class ClusterCommand extends Command {
  async run () {
    const { args, flags: _flags } = this.parse(ClusterCommand)
    const accessToken = config.get('accessToken')

    switch (args.operation) {
      case 'create':
        return clusters.create({ accessToken, ..._flags })

      case 'disable':
        return clusters.disable({ accessToken, ..._flags })

      case 'info':
        return clusters.info({ accessToken, ..._flags })

      case 'remove':
        return clusters.remove({ accessToken, ..._flags })

      case 'services':
        return clusters.services({ ..._flags })

      case 'update':
        return clusters.update({ accessToken, ..._flags })

      default:
        return clusters.list({ accessToken, ..._flags })
    }
  }
}

ClusterCommand.description = 'Manage your Bloq clusters'
ClusterCommand.flags = {
  serviceId: flags.string({ char: 's', description: 'service id' }),
  authType: flags.enum({
    char: 't',
    description: 'auth type: jwt, basic or none',
    default: 'basic',
    options: ['jwt', 'basic', 'none']
  }),
  capacity: flags.integer({
    char: 'c',
    description: 'capacity',
    default: 2
  }),
  onDemandCapacity: flags.integer({
    char: 'o',
    description: 'on-demand capacity',
    default: 1
  }),
  all: flags.boolean({
    char: 'a',
    description: 'list all clusters',
    default: false,
    required: false
  }),
  yes: flags.boolean({
    char: 'y',
    description: 'answer "yes" to prompts',
    default: false
  }),
  clusterId: flags.string({ char: 'i', description: 'cluster id' }),
  sort: flags.string({
    char: 'S',
    description: 'results sorting key',
    default: ''
  }),
  json: flags.boolean({ char: 'j', description: 'JSON output' }),
  abort: flags.boolean({
    description: 'Abort an (update) operation',
    default: false
  })
}

ClusterCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of cluster operation to run',
    default: 'list',
    options: ['create', 'disable', 'info', 'list', 'remove', 'services', 'update']
  }
]

module.exports = ClusterCommand
