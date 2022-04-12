'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
const config = require('../config')
require('console.table')

async function listUserKeys(user, accessToken, { type }) {
  consola.info(`Getting user keys for user ${user}.`)

  const env = config.get('env') || 'prod'
  let url = `${config.get(`services.${env}.accounts.url`)}/users/me/keys`

  if (type) {
    url += `/${type}`
  }

  const params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  fetch(url, params)
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 201) {
        return consola.error(
          `Error listing user keys: ${res.statusText || res.status}.`
        )
      }

      return res.json()
    })
    .then(function (res) {
      const body = res

      process.stdout.write('\n')

      for (const keys in body) {
        const keyType = keys.replace('keys', '')
        if (type && type !== keyType) {
          continue
        }

        consola.success(`Retrieved ${body[keys].length} ${keyType} user keys:`)
        process.stdout.write('\n')

        body[keys] = body[keys].map((k, id) => {
          const value = k.email || k.address
          return {
            id,
            value,
            verificationToken: k.verificationToken || '-',
            verifiedAt: k.verifiedAt || '-',
            type: keyType.toUpperCase()
          }
        })
        // eslint-disable-next-line no-console
        return console.table(body[keys])
      }
    })
    .catch(err => consola.error(`Error listing user keys: ${err}.`))
}

module.exports = listUserKeys
