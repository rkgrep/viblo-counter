const db = require('./database')
const { map, each } = require('lodash')
const moment = require('moment')

const createMigrationsTable = async () => {
    console.log('Creating migrations table')
    await db.query(`CREATE TABLE migrations (
        migration VARCHAR(200) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL
    )`)
}

const getMigrations = async () => {
    try {
        const { rows } = await db.query('SELECT * from migrations ORDER BY migration ASC')
        return rows
    } catch (e) {
        await createMigrationsTable()
        return []
    }
}

const migrations = {
    '1-create-records': {
        up: async () => {
            await db.query(`CREATE TABLE records (
                host VARCHAR(200) NOT NULL,
                page VARCHAR(200) NOT NULL,
                name VARCHAR(200) DEFAULT NULL,
                session_id UUID NOT NULL,
                metadata JSON DEFAULT NULL,
                created_at TIMESTAMP
            )`)
        },
        check: async () => {
            await db.query('SELECT 1 from records')
        },
    }
}

module.exports = async () => {
    const current = map(await getMigrations(), 'migration')
    console.log(current)
    for (let key in migrations) {
        if (current.indexOf(key) > -1) {
            console.log(`Checking: ${key}`)
            await migrations[key].check()
            return
        }
        console.log(`Migrating: ${key}`)
        await migrations[key].up()
        await db.query('INSERT INTO migrations (migration, created_at) VALUES ($1, $2)', [
            key,
            moment().format('YYYY-MM-DD HH:mm:ss'),
        ])
        console.log(`Finished: ${key}`)
    }
    return true
}
