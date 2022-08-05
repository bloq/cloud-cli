'use strict'

const consola = require('consola')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
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
async function removeCluster({ accessToken, force, json, ...flags }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Removing cluster')

  const prompt = await inquirer.prompt([
    {
      name: 'clusterId',
      message: 'Enter the cluster id',
      type: 'text',
      validate: input => isFormatValid('cluster', input),
      when: () => !flags.clusterId
    },
    {
      name: 'yes',
      message: `You will remove the cluster. Do you want to continue?`,
      type: 'confirm',
      default: false,
      when: () => !flags.yes
    }
  ])

  const { yes, clusterId } = {
    ...flags,
    ...prompt
  }

  if (!clusterId) {
    formatErrorResponse(isJson, 'Missing cluster id')
    return
  }

  if (!yes) {
    formatResponse(isJson, 'No action taken')
    return
  }

  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = force
    ? `${serviceUrl}/clusters/${clusterId}`
    : `${serviceUrl}/users/me/clusters/${clusterId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(isJson, `Error removing the cluster: ${res.message}`)
      return
    }

    formatResponse(isJson, `Cluster with ID ${clusterId} removed successfully`)
  })
}

module.exports = removeCluster
