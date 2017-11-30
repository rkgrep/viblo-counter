const { Pool } = require('pg')

// Config injected from env
const pool = new Pool()

module.exports = pool
