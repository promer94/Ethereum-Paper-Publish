const serve = require('koa-static')
const Koa = require('koa')

const app = new Koa()
app.use(serve(`${__dirname}/demo/build`))
app.listen(9000)
