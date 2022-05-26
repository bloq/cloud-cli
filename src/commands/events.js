/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const { Command, flags } = require('@oclif/command')
const config = require('../config')
require('console.table')

class EventsCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const { flags } = this.parse(EventsCommand)

    if (!user || !accessToken) {
      consola.error(
        'User is not authenticated. Use login command to start a new session.'
      )
      return
    }

    consola.info(`Retrieving events for user ${user}`)

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/me/events`

    return fetcher(url, 'GET', accessToken).then(res => {
      if (!res.ok) {
        consola.error(`Error retrieving events: ${res.status}`)
        return
      }

      const data = res.data

      let events = data.map(({ id, service, serviceData, createdAt }) => ({
        id,
        service,
        serviceData: JSON.stringify(serviceData),
        createdAt
      }))

      if (flags.service) {
        events = events.filter(e =>
          e.service.toLowerCase().includes(flags.service)
        )
      }

      consola.success(`Retrieved ${events.length} events:`)
      process.stdout.write('\n')
      // eslint-disable-next-line no-console
      console.table(events)
    })
  }
}

EventsCommand.description = 'Get Bloq daily events'

EventsCommand.flags = {
  service: flags.string({ char: 's', description: 'service name' })
}

module.exports = EventsCommand
