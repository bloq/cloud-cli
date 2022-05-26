'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const config = require('../config')
require('console.table')

async function listUserKeys(user, accessToken, { type }) {
  consola.info(`Getting user keys for user ${user}.`)

  const env = config.get('env') || 'prod'
  let url = `${config.get(`services.${env}.accounts.url`)}/users/me/keys`

  if (type) {
    url += `/${type}`
  }

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      consola.error(`Error listing user keys: ${res.status}`)
      return
    }

    const body = res.data

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
      console.table(body[keys])
    }
  })
}

module.exports = listUserKeys
