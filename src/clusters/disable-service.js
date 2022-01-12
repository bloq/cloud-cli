'use strict'
const consola = require('consola')
const fetch = require('node-fetch').default
const inquirer = require('inquirer')
const ora = require('ora')

const config = require('../config')

const env = config.get('env')
const serviceUrl = config.get(`services.${env}.nodes.url`)

const getUrlAndMethod = ({ serviceId }) => ({
  method: 'delete',
  url: `${serviceUrl}/services/cluster/${serviceId}`
})

/**
 * Disable a service by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.serviceId Service ID
 * @returns {Promise} The update service promise
 */
async function disable ({ accessToken, ...flags }) {
  consola.info('Disabling service')

  const prompt = await inquirer.prompt([
    {
      name: 'serviceId',
      message: 'Enter the service id',
      type: 'text',
      when: () => !flags.serviceId,
      validate: input => !!input
    }
  ])

  const { serviceId } = {
    ...flags,
    ...prompt
  }

  const spinner = ora().start()

  try {
    const { method, url } = getUrlAndMethod({ serviceId })
    const authorization = `Bearer ${accessToken}`
    const res = await fetch(url, {
      method,
      headers: { authorization }
    })

    if (!res.ok) {
      const data = await res.json()

      throw new Error(data.detail || data.title || res.statusText)
    }

    consola.success(`Service ${serviceId} disabled successfully`)
  } catch (err) {
    consola.error(`Error disabling the service: ${err.message}`)
  } finally {
    spinner.stop()
  }
}

module.exports = disable
