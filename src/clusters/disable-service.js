'use strict'
const consola = require('consola')
const fetch = require('node-fetch').default
const inquirer = require('inquirer')
const ora = require('ora')

const config = require('../config')

const env = config.get('env')
const serviceUrl = config.get(`services.${env}.nodes.url`)

const getConfirmationMessage = flags =>
  flags.abort
    ? 'You will cancel the current service disable process'
    : `You will disable the service ${flags.serviceId}`

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
    },
    {
      name: 'yes',
      message: `${getConfirmationMessage(flags)}. Do you want to continue?`,
      type: 'confirm',
      default: false,
      when: () => !flags.yes
    }
  ])

  const { yes, serviceId } = {
    ...flags,
    ...prompt
  }

  if (!yes) {
    consola.error('No action taken')
    return
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

      if (data.status === 401 || data.status === 403) {
        consola.error('Unauthorized/Forbidden')
        return
      }

      if (data.status === 404) {
        consola.error('Service not found')
        return
      }

      if (data.status !== 200) {
        consola.error(`Error disabling the service: ${data.title}`)
        return
      }
    }

    consola.success(`Service ${serviceId} disabled successfully`)
  } catch (err) {
    consola.error(`Error updating the service: ${err.message}`)
  } finally {
    spinner.stop()
  }
}

module.exports = disable
