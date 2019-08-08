'use strict'

const consola = require('consola')
const clipboardy = require('clipboardy')

function coppyToClipboard (value, name) {
  try {
    clipboardy.writes(value)
    consola.info(`${name} was copied to clipboard.`)
  } catch (err) {}
}

module.exports = {
  coppyToClipboard
}
