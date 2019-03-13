'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

async function infoNode (user, accessToken, flags) {
  consola.info(`Retrieving node for user ${user}.`)
  let { nodeId } = flags

  if (!nodeId) {
    const prompt = await inquirer.prompt([
      { name: 'nodeId', message: 'Enter the node id', type: 'text' }
    ])

    nodeId = prompt.nodeId
  }

  const Authorization = `Bearer ${accessToken}`
  const url = `${config.get('services.nodes.url')}/nodes/${nodeId}`
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

    consola.log(`
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

module.exports = infoNode
