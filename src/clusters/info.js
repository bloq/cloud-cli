'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
const inquirer = require('inquirer')

const config = require('../config')

const getState = body =>
  body.state === 'started' && body.updatingService ? 'updating' : body.state

const getCreds = body =>
  body.auth.type === 'jwt'
    ? `
    * Auth:\t\tJWT`
    : body.auth.type === 'basic'
    ? `
    * User:\t\t${body.auth.user}
    * Password:\t\t${body.auth.pass}`
    : `
    * Auth:\t\tnone`

/**
 * Retrieves cluster information by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.clusterId Cluster ID
 * @returns {Promise} The information cluster promise
 */
async function infoCluster({ accessToken, clusterId }) {
  consola.info('Retrieving cluster information')

  if (!clusterId) {
    const prompt = await inquirer.prompt([
      { name: 'clusterId', message: 'Enter the cluster id', type: 'text' }
    ])
    // eslint-disable-next-line no-param-reassign
    clusterId = prompt.clusterId
    if (!clusterId) {
      consola.error('Missing cluster id')
      return
    }
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = `${serviceUrl}/users/me/clusters/${clusterId}`
  const spinner = ora().start()

  const params = {
    method: 'GET',
    headers: { Authorization }
  }
  fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401) {
        return consola.error('Unauthorized')
      }

      if (res.status === 403) {
        return consola.error('Your session has expired', res.status)
      }

      if (res.status === 404) {
        return consola.error(
          'Error retrieving cluster information, requested resource not found'
        )
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving the cluster: ${res.status} || ${res.statusText}`
        )
      }
      return res.json()
    })
    .then(res => {
      process.stdout.write('\n')
      consola.success(`Retrieved cluster with id ${clusterId}
      * ID:\t\t${res.id}
      * Name:\t\t${res.alias || res.name}
      * Chain:\t\t${res.chain}
      * Network:\t\t${res.network}
      * Version:\t\t${res.serviceData.software}
      * Performance:\t${res.serviceData.performance}
      * Domain:\t\t${res.domain}
      * Capacity:\t\t${res.onDemandCapacity}:${res.capacity}
      * Region:\t\t${res.region}
      * State:\t\t${getState(res)}${getCreds(res)}`)
    })
    .catch(err => consola.error(`Error retrieving the cluster: ${err}.`))
}

module.exports = infoCluster
