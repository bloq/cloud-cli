'use strict'

const create = require('./create')
const chains = require('./chains')
const disable = require('./disable-service')
const info = require('./info')
const list = require('./list')
const remove = require('./remove')
const services = require('./services')
const update = require('./update')

module.exports = {
  create,
  chains,
  disable,
  info,
  list,
  remove,
  services,
  update
}
