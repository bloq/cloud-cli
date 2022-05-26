'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { isFormatValid } = require('../validator')

const inquirer = require('inquirer')
const config = require('../config')

const env = config.get('env')
const serviceUrl = config.get(`services.${env}.nodes.url`)

const getConfirmationMessage = flags =>
  flags.abort
    ? 'You will cancel the current service update process of the cluster'
    : `You will update the cluster's ${
        flags.serviceId ? `service to ${flags.serviceId} and ` : ''
      }capacity to ${flags.capacity} total and ${
        flags.onDemandCapacity
      } on-demand`

const getUrlAndMethod = ({ abort, clusterId }) => ({
  method: abort ? 'delete' : 'patch',
  url: `${serviceUrl}/users/me/clusters/${clusterId}${
    abort ? '/updatingService' : ''
  }`
})

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
async function updateCluster({ accessToken, ...flags }) {
  consola.info('Updating cluster')

  const prompt = await inquirer.prompt([
    {
      name: 'clusterId',
      message: 'Enter the cluster id',
      type: 'text',
      when: () => !flags.clusterId,
      validate: input => isFormatValid('cluster', input)
    },
    {
      name: 'yes',
      message: `${getConfirmationMessage(flags)}. Do you want to continue?`,
      type: 'confirm',
      default: false,
      when: () => !flags.yes
    }
  ])

  const { yes, clusterId, capacity, onDemandCapacity, serviceId, abort } = {
    ...flags,
    ...prompt
  }

  if (!yes) {
    consola.error('No action taken')
    return null
  }

  const { method, url } = getUrlAndMethod({ abort, clusterId })
  const body = abort
    ? null
    : JSON.stringify({ capacity, onDemandCapacity, serviceId })

  return fetcher(url, method, accessToken, body).then(res => {
    if (!res.ok)
      return consola.error(`Error updating the service: ${res.status}`)

    return consola.success(`Service ${serviceId} disabled successfully`)
  })
}

module.exports = updateCluster
