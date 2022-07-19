/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
const { isFormatValid } = require('../validator')

const inquirer = require('inquirer')
const config = require('../config')

/**
 * Retrieves a node information by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.nodeId Node ID
 * @returns {Promise} The information node promise
 */
async function infoNode({ accessToken, nodeId, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info(`Retrieving node with ID ${nodeId}.`)

  if (!nodeId) {
    const prompt = await inquirer.prompt([
      {
        name: 'nodeId',
        message: 'Enter the node id',
        type: 'text',
        validate: input => isFormatValid('node', input)
      }
    ])
    nodeId = prompt.nodeId
    if (!nodeId) {
      consola.error('Missing node id')
      return
    }
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}`

  // eslint-disable-next-line consistent-return
  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error retrieving node information, requested resource not found: ${res.status}`
      )
      return
    }
    let body = res.data
    const {
      id,
      auth,
      state,
      chain,
      network,
      serviceData,
      ip,
      stoppedAt,
      createdAt
    } = body
    const creds =
      auth.type === 'jwt'
        ? '* Auth:\t\tJWT'
        : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

    if (isJson) {
      formatResponse(isJson, {
        id,
        createdAt,
        stoppedAt,
        chain,
        network,
        version: serviceData.software,
        performance: serviceData.performance,
        state,
        ip,
        creds
      })
      return
    }

    process.stdout.write('\n')

    consola.success(`Retrieved node with id ${nodeId}
    * ID:\t\t${id}
    * Started At:\t${createdAt}
    * Stopped At:\t${stoppedAt || 'N/A'}
    * Chain:\t\t${chain}
    * Network:\t\t${network}
    * Version:\t\t${serviceData.software}
    * Performance:\t${serviceData.performance}
    * State:\t\t${state}
    * IP:\t\t${ip}
    ${creds}`)
  })
}

module.exports = infoNode
