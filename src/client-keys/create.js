'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const clipboardy = require('clipboardy')

const { accountsUrl } = require('../config')

async function createClientKey (user, accessToken) {
  consola.info(`Creating new pair of client keys for user ${user}.`)

  const { save } = await inquirer.prompt([
    {
      name: 'save',
      message: 'Do you want blc to store your tokens locally for future usage?',
      type: 'confirm'
    }
  ])

  const Authorization = `Bearer ${accessToken}`
  const url = `${accountsUrl}/client-keys`

  request.post(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error creating new pair of client keys: ${err}.`)
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error creating new pair of client keys: ${body.code || body.message}.`)
    }

    process.stdout.write('\n')
    consola.success(`Generated new client keys:
    * Client ID:\t${body.clientId}
    * Client Secret:\t${body.clientSecret}
    `)

    clipboardy.write(body.clientSecret)
    consola.info('Client secret was copied to clipboard.')
    consola.warn('You will be not able to see your client secret again. Remember to copy it and keep it safe.')

    if (save) {
      config.set('clientId', body.clientId)
      config.set('clientSecret', body.clientSecret)
    }
  })
}

module.exports = createClientKey
