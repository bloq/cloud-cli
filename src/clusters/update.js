'use strict'

const consola = require('consola')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
const { isFormatValid } = require('../validator')

const inquirer = require('inquirer')
const config = require('../config')

const env = config.get('env')
const serviceUrl = config.get(`services.${env}.nodes.url`)

const getConfirmationMessage = flags =>
  flags.alias
    ? `You will set the cluster alias to '${flags.alias}'`
    : flags.abort
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
 * @param {Object} params.alias Clusters alias
 * @returns {Promise} The update cluster promise
 */
async function updateCluster({ accessToken, json, ...flags }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Updating cluster')

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

  const {
    yes,
    clusterId,
    capacity,
    onDemandCapacity,
    serviceId,
    abort,
    alias
  } = {
    ...flags,
    ...prompt
  }

  if (!yes) {
    formatResponse(isJson, 'No action taken')
    return null
  }

  let method, url, body

  if (typeof alias !== 'undefined') {
    body = JSON.stringify({ alias })
    method = 'POST'
    url = `${serviceUrl}/users/me/clusters/${clusterId}/alias`
  } else {
    ;({ method, url } = getUrlAndMethod({ abort, clusterId }))
    body = abort
      ? null
      : JSON.stringify({ capacity, onDemandCapacity, serviceId })
  }

  return fetcher(url, method, accessToken, body).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error updating the service: ${res.message || res.status}`
      )
      return
    }

    formatResponse(isJson, `Cluster ${clusterId} updated successfully`)
  })
}

module.exports = updateCluster
