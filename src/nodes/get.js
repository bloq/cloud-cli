'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const { nodesUrl } = require('../config')

async function listNodes (user, accessToken) {
  consola.info(`Getting node for user ${user}.`)
  const spinner = ora().start()

  const { nodeId } = await inquirer.prompt([
    { name: 'nodeId', message: 'Enter the node id', type: 'text' }
  ])

  const Authorization = `Bearer ${accessToken}`
  const url = `${nodesUrl}/nodes/${nodeId}`
  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error trying to get the node: ${err}.`)
    }

    let body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error trying to get the node: ${body.code}.`)
    }

    body = body[0]
    const { image, state, instance, startedAt, stopedAt, vendor } = body
    consola.success(`Got node with id ${nodeId}`)
    process.stdout.write('\n')

    consola.success(`
    * Image: \t\t${image}
    * Started At:\t${startedAt}
    * Stoped At:\t${stopedAt || '-'}
    * State:\t\t${state.toUpperCase()}

    * Instance:
    \t- Vendor:\t${instance.vendor}
    \t- ${instance.vendor.toUpperCase()} ID:\t${instance.id}
    \t- Type:\t\t${instance.type}
    \t- Image ID:\t${instance.imageId}

    * Vendor:
    \t- LaunchTime:\t${vendor.LaunchTime}
    \t- Architecture:\t${vendor.Architecture}
    \t- PublicDnsName:\t${vendor.PublicDnsName || '-'}
    `)
  })
}

module.exports = listNodes
