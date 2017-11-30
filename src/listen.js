const app = require('./app')
const db = require('./database')
const migrate = require('./migrate')

module.exports = async (port = 3000) => {
    try {
        await db.connect()
        await migrate()
        app.listen(port)
        console.log('Listening')
    } catch (e) {
        console.error(e)
    }
}
