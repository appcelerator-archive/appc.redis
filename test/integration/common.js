/* global before, after */
var Arrow = require('arrow')
var server = new Arrow({ignoreDuplicateModels: true, logLevel: 'fatal'})
var log = (server && server.logger) || Arrow.createLogger({}, {name: 'appc.redis TEST'})

exports.Arrow = Arrow
exports.log = log
exports.server = server
exports.testDb = process.env.testDB || 15
exports.isRemote = server.config.connectors['appc.redis'].host !== '127.0.0.1'

before(function (next) {
  exports.connector = server.getConnector('appc.redis')

  if (exports.connector.config.opts) {
    exports.connector.config.opts.db = exports.testDb
  } else {
    exports.connector.config.opts = {
      db: exports.testDb
    }
  }

  log.info('Redis test DB: ' + exports.connector.config.opts.db)

  server.start(next)
})

after(function (next) {
  if (!exports.connector) {
    return server.stop(next)
  }
  exports.connector.client.flushdb(function (err) {
    if (err) {
      log.error(err.message)
    } else {
      log.info('Emptied test db at: ' + exports.connector.config.opts.db)
    }
    server.stop(next)
  })
})
