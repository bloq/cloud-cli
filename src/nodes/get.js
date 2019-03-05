'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const { nodesUrl } = require('../config')

async function listNodes (user, accessToken) {
  consola.info(`Retrieving node for user ${user}.`)

  const { nodeId } = await inquirer.prompt([
    { name: 'nodeId', message: 'Enter the node id', type: 'text' }
  ])

  const Authorization = `Bearer ${accessToken}`
  const url = `${nodesUrl}/nodes/${nodeId}`
  const spinner = ora().start()

  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving the node: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    let body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving the node: ${body.code}.`)
    }

    body = body[0]
    const { image, state, instance, startedAt, stopedAt, vendor } = body
    consola.success(`Retrieved node with id ${nodeId}`)
    process.stdout.write('\n')

    consola.success(`
    * Image: \t\t${image}
    * Started At:\t${startedAt}
    * Stopped At:\t${stopedAt || '-'}
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
