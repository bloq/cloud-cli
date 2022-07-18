'use strict'
const consola = require('consola')
const { fetcher, formatResponse } = require('../utils')
const { isFormatValid } = require('../validator')

const inquirer = require('inquirer')
const config = require('../config')

/**
 * Disable a service by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.serviceId Service ID
 * @returns {Promise} The update service promise
 */
async function disable({ accessToken, json, ...flags }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Disabling service')

  const prompt = await inquirer.prompt([
    {
      name: 'serviceId',
      message: 'Enter the service id',
      type: 'text',
      when: () => !flags.serviceId,
      validate: input => isFormatValid('cluster', input)
    }
  ])

  const { serviceId } = {
    ...flags,
    ...prompt
  }

  const env = config.get('env')
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/services/cluster/${serviceId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) {
      formatResponse(isJson, `Error disabling the service: ${res.status}`)
      return
    }

    formatResponse(isJson, `Service ${serviceId} disabled successfully`, true)
  })
}

module.exports = disable
