'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
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
  const url = `${serviceUrl}/users/me/clusters/${clusterId}`
  const spinner = ora().start()

  const params = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  return fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status === 404) {
        return consola.error(
          'Error removing cluster, requested resource not found'
        )
      }

      if (res.status !== 204) {
        return consola.error(
          `Error removing the cluster:: ${res.statusText || res.status}.`
        )
      }

      return consola.success(
        `Cluster with ID ${clusterId} removed successfully`
      )
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error removing the cluster: ${err}.`)
    })
}

module.exports = removeCluster
