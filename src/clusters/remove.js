'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { isFormatValid } = require('../validator')

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
async function removeCluster({ accessToken, clusterId, force }) {
  consola.info('Removing cluster')

  if (!clusterId) {
    const prompt = await inquirer.prompt([
      {
        name: 'clusterId',
        message: 'Enter the cluster id',
        type: 'text',
        validate: input => isFormatValid('cluster', input)
      }
    ])

    // eslint-disable-next-line no-param-reassign
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

  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = force
    ? `${serviceUrl}/users/me/clusters/${clusterId}?force=${force}`
    : `${serviceUrl}/users/me/clusters/${clusterId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok)
      return consola.error(`Error removing the cluster: ${res.message}`)

    return consola.success(`Cluster with ID ${clusterId} removed successfully`)
  })
}

module.exports = removeCluster
