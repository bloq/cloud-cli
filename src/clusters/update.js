'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
const inquirer = require('inquirer')
const ora = require('ora')

const config = require('../config')

/**
 * Update a cluster's capacity by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.capacity Clusters total capacity
 * @param {Object} params.clusterId Cluster ID
 * @param {Object} params.onDemandCapacity Clusters on-demand capacity
 * @param {Object} params.serviceId Service ID
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
      message: `You will update the cluster's ${
        flags.serviceId ? `service to ${flags.serviceId} and ` : ''
      }capacity to ${flags.capacity} total and ${
        flags.onDemandCapacity
      } on-demand. Do you want to continue?`,
      type: 'confirm',
      default: false,
      when: () => !flags.yes
    }
  ])

  const { yes, clusterId, capacity, onDemandCapacity, serviceId } = {
    ...flags,
    ...prompt
  }

  if (!yes) {
    return consola.error('Update canceled')
  }

  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = `${serviceUrl}/users/me/clusters/${clusterId}`
  const authorization = `Bearer ${accessToken}`
  // const json = { clusterId, capacity, onDemandCapacity }

  const spinner = ora().start()

  try {
    const res = await fetch(url, {
      method: 'patch',
      headers: { authorization, 'content-type': 'application/json' },
      body: JSON.stringify({ capacity, onDemandCapacity, serviceId })
    })

    if (!res.ok) {
      const data = await res.json()

      if (data.status === 401 || data.status === 403) {
        return consola.error('Your session has expired')
      }

      if (data.status === 404) {
        return consola.error('Cluster not found')
      }

      if (data.status !== 200) {
        console.log(data)
        return consola.error(`Error updating the cluster: ${data.title}`)
      }
    }

    consola.success(`Cluster ${clusterId} updated successfully`)
  } catch (err) {
    consola.error(`Error updating the cluster: ${err.message}`)
  } finally {
    spinner.stop()
  }
}

module.exports = updateCluster
