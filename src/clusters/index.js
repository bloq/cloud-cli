'use strict'

const list = require('./list')
const info = require('./info')
const create = require('./create')
const remove = require('./remove')
const services = require('./services')

module.exports = {
  info,
  create,
  list,
  remove,
  services
}
