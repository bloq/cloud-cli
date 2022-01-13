'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
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

  request.get(
    url,
    { headers: { Authorization }, json: true },
    function (err, data) {
      spinner.stop()

      if (err) {
        consola.error(`Error retrieving the cluster: ${err}.`)
        return
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        consola.error('Your session has expired')
        return
      }

      if (data.statusCode === 404) {
        consola.error(
          'Error retrieving cluster information, requested resource not found'
        )
        return
      }

      const { body } = data

      if (data.statusCode !== 200) {
        consola.error(`Error retrieving the cluster: ${body.code}`)
        return
      }

      process.stdout.write('\n')
      consola.success(`Retrieved cluster with id ${clusterId}
    * ID:\t\t${body.id}
    * Name:\t\t${body.alias || body.name}
    * Chain:\t\t${body.chain}
    * Network:\t\t${body.network}
    * Version:\t\t${body.serviceData.software}
    * Performance:\t${body.serviceData.performance}
    * Domain:\t\t${body.domain}
    * Capacity:\t\t${body.onDemandCapacity}:${body.capacity}
    * Region:\t\t${body.region}
    * State:\t\t${getState(body)}${getCreds(body)}`)
    }
  )
}

module.exports = infoCluster
