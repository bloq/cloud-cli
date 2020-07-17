'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

/**
 * Update a cluster's capacity by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.capacity Clusters total capacity
 * @param {Object} params.clusterId Cluster ID
 * @param {Object} params.onDemandCapacity Clusters on-demand capacity
 * @returns {Promise} The update cluster promise
 */
async function updateCluster ({ accessToken, ...flags }) {
  consola.info('Updating cluster')

  const prompt = await inquirer.prompt([
    {
      name: 'clusterId',
      message: 'Enter the cluster id',
      type: 'text',
      when: () => !flags.clusterId,
      validate: input => !!input
    },
    {
      name: 'yes',
      message: `You will update the cluster's capacity to ${flags.capacity} total and ${flags.onDemandCapacity} on-demand. Do you want to continue?`,
      type: 'confirm',
      default: false,
      when: () => !flags.yes
    }
  ])

  const { yes, clusterId, capacity, onDemandCapacity } = { ...flags, ...prompt }

  if (!yes) {
    return consola.error('Update canceled.')
  }

  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = `${serviceUrl}/users/me/clusters/${clusterId}`
  const Authorization = `Bearer ${accessToken}`
  const json = { clusterId, capacity, onDemandCapacity }

  const spinner = ora().start()

  return request.patch(url, { headers: { Authorization }, json }, function (
    err,
    data
  ) {
    spinner.stop()

    if (err) {
      return consola.error(`Error updating the cluster: ${err.message}`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 404) {
      return consola.error('Cluster not found')
    }

    if (data.statusCode !== 200) {
      const body = JSON.parse(data.body)
      return consola.error(`Error updating the cluster: ${body.code}`)
    }

    consola.success(`Cluster with ID ${clusterId} updated successfully`)
  })
}

module.exports = updateCluster
