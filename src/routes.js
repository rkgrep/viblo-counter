const uuid = require('uuid/v4')
const moment = require('moment')
const { get } = require('lodash')
const KoaRouter = require('koa-router')
const router = KoaRouter()

router.get('/init', ctx => {
    if (!ctx.session.visit_id) {
        ctx.session.visit_id = uuid()
    }
    ctx.status = 200
    ctx.body = ctx.session.visit_id
})

router.get('/check', ctx => {
    ctx.status = 200
    ctx.body = ctx.session.visit_id
})

router.get('/all', async ctx => {
    const { db } = ctx

    const { rows } = await db.query('SELECT * from records ORDER BY created_at DESC')
    ctx.status = 200
    ctx.body = JSON.stringify(rows)
})

router.post('/track', ctx => {
    const { db, session, query } = ctx

    if (!session.visit_id) {
        ctx.status = 401
        ctx.body = 'Session must be initiated'
        return
    }

    ctx.status = 200
    ctx.body = 'Ok'

    db.query(
        'INSERT INTO records (host, page, name, session_id, metadata, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [
            get(query, 'host', 'undefined'),
            get(query, 'page', '/'),
            get(query, 'name', null),
            session.visit_id,
            JSON.stringify(ctx.request.body),
            get(query, 'timestamp', moment().format('YYYY-MM-DD HH:mm:ss'))
        ]
    )
})

module.exports = router
