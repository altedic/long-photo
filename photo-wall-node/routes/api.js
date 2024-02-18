const path = require('path');
const router = require('koa-router')();
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const db = new JsonDB(
  new Config(path.join(__dirname, './db/myDataBase.json'), true, true, '/')
);
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // 用于签发、解析`token`
const secret = require('../config/config').secret; // 引入密钥')

router.prefix('/api');

/* 获取一个期限为4小时的token */
function getToken(payload = {}) {
  return jwt.sign(payload, secret, { expiresIn: '4h' });
}
/**写一个方法对字符串进行MD5加密 */
function md5(str) {
  let md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}
/* 通过token获取JWT的payload部分 */
function getJWTPayload(token) {
  // 验证并解析JWT
  return jwt.verify(token.split(' ')[1], secret);
}
/**
 * 生成随机字符串
 */
function generateRandomString() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

router.get('/test', async (ctx, next) => {
  // 返回一个对象
  ctx.body = {
    title: 'koa2 json',
  };
});

/**
 * 登录接口
 */
router.all('/login', async (ctx, next) => {
  // 接收到post参数
  let { username = '', password = '' } = ctx.request.body;
  let trimUserName = username.trim();

  let md5Password = md5(password);

  let res = await db.filter('/user', function (value) {
    if (value.username.trim() === trimUserName) {
      return true;
    }
    return false;
  });
  if (res.length === 0) {
    // 返回失败
    ctx.body = {
      code: 1,
      message: '用户名不存在',
      data: {},
    };
    return;
  }
  if (res[0].password !== md5Password) {
    // 返回失败
    ctx.body = {
      code: 1,
      message: '密码错误',
      data: {},
    };
    return;
  }

  let token = getToken({ username: trimUserName });

  // 返回成功
  ctx.body = {
    code: 0,
    message: '登录成功',
    data: {
      token,
    },
  };
});

/**
 * 注册接口
 */
router.all('/register', async (ctx, next) => {
  // 接收到post参数
  let { username = '', password = '' } = ctx.request.body;
  // 给crypto密码md5加密
  let md5Password = md5(password);

  // nodejs对密码进行md5加密

  let trimUserName = username.trim();

  if (trimUserName === '') {
    ctx.body = {
      code: 1,
      message: '用户名不能为空',
      data: {},
    };
    return;
  }
  try {
    let res = await db.filter('/user', function (value) {
      if (value.username.trim() === trimUserName) {
        return true;
      }
      return false;
    });
    if (res.length > 0) {
      // 返回失败
      ctx.body = {
        code: 1,
        message: '用户名已存在',
        data: {},
      };
      return;
    }

    db.push('/user[]', { username: trimUserName, password: md5Password });

    // 返回成功
    ctx.body = {
      code: 0,
      message: '注册成功',
      data: {},
    };
  } catch (e) {
    // 返回失败
    ctx.body = {
      code: 1,
      message: '注册失败',
      data: {},
    };
  }
});

/**
 * 获取用户信息
 */
router.get('/user-info', async (ctx, next) => {
  // 获取token信息
  let token = ctx.header.authorization;
  let userInfo = getJWTPayload(token);
  ctx.body = {
    code: 0,
    message: '获取成功',
    data: {
      userInfo,
    },
  };
});

/**
 * 生成相册
 */
router.post('/photo-wall', async (ctx, next) => {
  console.log('ctx.request.body', ctx.request.body);
  try {
  // 获取body的list参数
    let { list = [] } = ctx.request.body;
    // 获取token信息
    let token = ctx.header.authorization;
    let userInfo = getJWTPayload(token);
    let id = generateRandomString(); // 生成随机ID
    db.push('/photo-wall[]', { id: id, list, username: userInfo.username });

    ctx.body = {
      code: 0,
      message: '保存成功',
      data: {
        userInfo,
      },
  };
  } catch (e){
    console.error(e);
  }
  
});

/**
 * 查询相册
 */
router.get('/photo-wall', async (ctx, next) => {
  // 获取token信息
  console.log('ctx.request.body', ctx.request.body);
try{
  let token = ctx.header.authorization;
  let userInfo = getJWTPayload(token);
  let res = await db.filter('/photo-wall', function (value) {
    if (value.username === userInfo.username) {
      return true;
    }
    return false;
  });
  ctx.body = {
    code: 0,
    message: '获取成功',
    data: {
      list: res,
    },
  };
}catch(e){
  console.error(e);
}

});

module.exports = router;
