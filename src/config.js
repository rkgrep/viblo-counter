const envalid = require('envalid')
const crypto = require('cryptojs')
const {
    makeValidator,
    cleanEnv,
    EnvError,
    str,
    num,
    host,
    port,
} = envalid

const base64Str = makeValidator((input) => {
    if (typeof input !== 'string' || input.length === 0) {
        throw new EnvError(`Not a string: "${input}"`)
    }
    // Decode Laravel-style base64-encoded key
    if (input.startsWith('base64:')) {
        return Buffer.from(input.substr(7), 'base64').toString('utf8')
    }
    return input.toString()
})

module.exports = cleanEnv(process.env, {
    APP_KEY: base64Str({
        desc: 'Encryption key',
    }),
    SESSION_COOKIE: str({
        default: 'counter::session',
        desc: 'Session cookie name',
    }),
    SESSION_MAX_AGE: num({
        default: 1000 * 60 * 30, // 30 minutes.
        desc: 'Session max age',
    }),
    PGUSER: str({
        desc: 'Postgres Database user',
    }),
    PGPASSWORD: str({
        desc: 'Postgres Database password',
    }),
    PGHOST: host({
        desc: 'Postgres Database host',
    }),
    PGDATABASE: str({
        desc: 'Postgres Database name',
    }),
    PGPORT: port({
        default: 5432,
        desc: 'Postgres Database port',
    })
})
