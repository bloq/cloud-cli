'use strict'

const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

const notifier = updateNotifier({ pkg })

notifier.notify()
// notifier.update && console.log(notifier.update)
