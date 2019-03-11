'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

async function removeNode (user, accessToken, flags) {
  consola.info(`Removing node for user ${user}.`)
  let { nodeId } = flags

  if (!nodeId) {
    nodeId = await inquirer.prompt([
      { name: 'nodeId', message: 'Enter the node id', type: 'text' }
    ])
  }

  const { confirmation } = await inquirer.prompt([{
    name: 'confirmation',
    message: `You will remove the node with id ${nodeId}. Do you want to continue?`,
    type: 'confirm'
  }])

  if (!confirmation) {
    return consola.error('Remove node was canceled.')
  }

  const Authorization = `Bearer ${accessToken}`
  const url = `${config.get('services.nodes.url')}/nodes/${nodeId}`
  const spinner = ora().start()

  request.del(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error removing the node: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 204) {
      const body = JSON.parse(data.body)
      return consola.error(`Error removing the node: ${body.code}.`)
    }

    consola.success(`Removed node with id ${nodeId}`)
  })
}

module.exports = removeNode
