'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

/**
 * Removes a cluster by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.clusterId Cluster ID
 * @returns {Promise} The remove cluster promise
 */
async function removeCluster({ accessToken, clusterId }) {
  consola.info('Removing cluster')

  if (!clusterId) {
    const prompt = await inquirer.prompt([
      { name: 'clusterId', message: 'Enter the cluster id', type: 'text' }
    ])

    clusterId = prompt.clusterId
    if (!clusterId) {
      return consola.error('Missing cluster id')
    }
  }

  const { confirmation } = await inquirer.prompt([
    {
      name: 'confirmation',
      message: `You will remove the cluster with id ${clusterId}. Do you want to continue?`,
      type: 'confirm',
      default: false
    }
  ])

  if (!confirmation) {
    return consola.error('Remove cluster was canceled.')
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = `${serviceUrl}/users/me/clusters/${clusterId}`
  const spinner = ora().start()

  return request.del(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error removing the cluster: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 404) {
      return consola.error(
        'Error removing cluster, requested resource not found'
      )
    }

    if (data.statusCode !== 204) {
      const body = JSON.parse(data.body)
      return consola.error(`Error removing the cluster: ${body.code}.`)
    }

    consola.success(`Cluster with ID ${clusterId} removed successfully`)
  })
}

module.exports = removeCluster
