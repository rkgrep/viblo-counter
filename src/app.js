const Koa = require('koa')
const KoaSession = require('koa-session')
const KoaCors = require('@koa/cors')
const KoaBodyParser = require('koa-bodyparser');

const app = new Koa()
const db = require('./database')
const routes = require('./routes')

const {
    APP_KEY,
    SESSION_COOKIE,
    SESSION_MAX_AGE,
} = require('./config')

app.keys = [APP_KEY]

app.context.db = db

const session = KoaSession({
    key: SESSION_COOKIE,
    // Basically this is visit timeout
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    rolling: true,
}, app)

const parser = KoaBodyParser()
const cors = KoaCors()

app.use(cors)
app.use(session)
app.use(parser)
app.use(routes.routes())

module.exports = app
