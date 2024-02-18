const { secretId, secretKey, bucket, region } = require('../config/config');
// 配置参数
var config = {
  secretId: secretId, // 固定密钥
  secretKey: secretKey, // 固定密钥
  proxy: '',
  durationSeconds: 1800,
  // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
  endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

  // 放行判断相关参数
  bucket: bucket,
  region: region,
  allowPrefix: 'photo-wall/*', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
  // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
  allowActions: [
    // 简单上传
    'name/cos:PutObject',
    'name/cos:PostObject',
    // 分片上传
    'name/cos:InitiateMultipartUpload',
    'name/cos:ListMultipartUploads',
    'name/cos:ListParts',
    'name/cos:UploadPart',
    'name/cos:CompleteMultipartUpload',
  ],
};
var STS = require('qcloud-cos-sts');
const router = require('koa-router')();
router.prefix('/api/cos');

const stsMake = (policy) => {
  return new Promise((resolve) => {
    STS.getCredential(
      {
        secretId: config.secretId,
        secretKey: config.secretKey,
        proxy: config.proxy,
        durationSeconds: config.durationSeconds,
        endpoint: config.endpoint,
        policy: policy,
      },
      function (err, tempKeys) {
        var result = JSON.stringify(err || tempKeys) || '';
        resolve(result);
      }
    );
  });
};

router.all('/sts', async (ctx, next) => {
  // 获取临时密钥
  var shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'));
  var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
  var policy = {
    version: '2.0',
    statement: [
      {
        action: config.allowActions,
        effect: 'allow',
        principal: { qcs: ['*'] },
        resource: [
          'qcs::cos:' +
            config.region +
            ':uid/' +
            appId +
            ':prefix//' +
            appId +
            '/' +
            shortBucketName +
            '/' +
            config.allowPrefix,
        ],
        // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
        // 'condition': {
        //   // 比如限定ip访问
        //   'ip_equal': {
        //     'qcs:ip': '10.121.2.10/24'
        //   }
        // }
      },
    ],
  };
  ctx.body = await stsMake(policy);
});

module.exports = router;
