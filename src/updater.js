'use strict'

const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 1 // 1 Day
})

notifier.notify()
