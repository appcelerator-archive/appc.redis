module.exports = {
    connectors: {
        'appc.redis': {
            host: '127.0.0.1',
            port: 6379,
            db: 1,
            opts: {
                parser: 'hiredis'
            }
        }
    }
};