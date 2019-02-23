'use strict'

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const { accountsUrl } = require('../config')

async function createClientKeys (user, accessToken) {
  consola.info(`Removing client key for user ${user}.`)

  const { clientId } = await inquirer.prompt([
    { name: 'clientId', message: 'Enter the client-key id', type: 'text' }
  ])

  const { confirmation } = await inquirer.prompt([{
    name: 'confirmation',
    message: `You will remove client key with id ${clientId}. Do you want to continue?`,
    type: 'confirm'
  }])

  if (!confirmation) {
    return consola.error('Remove client key canceled.')
  }

  const Authorization = `Bearer ${accessToken}`
  const url = `${accountsUrl}/client-keys/${clientId}`

  request.del(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error trying to remove the client keys: ${err}.`)
    }

    if (data.statusCode !== 204) {
      const body = JSON.parse(data.body)
      return consola.error(`Error trying to list client keys: ${body.code}.`)
    }

    consola.success(`Removed client key with id ${clientId}`)
  })
}

module.exports = createClientKeys
