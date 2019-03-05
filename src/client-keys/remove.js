'use strict'

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const { accountsUrl } = require('../config')

async function removeClientKey (user, accessToken) {
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
    return consola.error('Remove client key was canceled.')
  }

  const Authorization = `Bearer ${accessToken}`
  const url = `${accountsUrl}/client-keys/${clientId}`

  request.del(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error removing the client-key: ${err}.`)
    }

    if (data.statusCode !== 204) {
      const body = JSON.parse(data.body)
      return consola.error(`Error removing client-key: ${body.code}.`)
    }

    consola.success(`Removed client key with id ${clientId}`)
  })
}

module.exports = removeClientKey
