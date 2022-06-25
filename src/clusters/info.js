/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { isFormatValid } = require('../validator')

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
async function infoCluster({ accessToken, clusterId, json }) {
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
      consola.error('Missing cluster id')
      return
    }
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/clusters/${clusterId}`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      consola.error(`Error retrieving cluster: ${res.status}`)
      return
    }

    const data = res.data

    if (typeof json !== 'undefined') {
      console.log(JSON.stringify(data))
    } else {
      consola.info('Retrieving cluster information')
      process.stdout.write('\n')
      consola.success(`Retrieved cluster with id ${clusterId}
      * ID:\t\t${data.id}
      * Name:\t\t${data.alias || data.name}
      * Chain:\t\t${data.chain}
      * Network:\t\t${data.network}
      * Version:\t\t${data.serviceData.software}
      * Performance:\t${data.serviceData.performance}
      * Domain:\t\t${data.domain}
      * Capacity:\t\t${data.onDemandCapacity}:${data.capacity}
      * Region:\t\t${data.region}
      * State:\t\t${getState(data)}${getCreds(data)}`)
    }
  })
}

module.exports = infoCluster
