const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api'); // Add this line
const cosApi = require('./routes/cos'); // Add this line

const jwtKoa = require('koa-jwt'); // 用于路由权限控制

const secret = require('./config/config').secret; // 引入密钥')

// error handler
onerror(app);


/* 当token验证异常时候的处理，如token过期、token错误 */
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  });
});
/* 路由权限控制 */
app.use(
  jwtKoa({ secret: secret }).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
      /^\/api\/login/,
      /^\/api\/register/,
      /^((?!\/api).)*$/, // 设置除了私有接口外的其它资源，可以不需要认证访问
    ],
  })
);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'ejs',
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(api.routes(), api.allowedMethods()); // Add this line
app.use(cosApi.routes(), cosApi.allowedMethods()); // Add this line

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
