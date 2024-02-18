import COS from 'cos-js-sdk-v5';
const cos = new COS({
  // getAuthorization 必选参数
  getAuthorization: function (options, callback) {
    // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
    // 异步获取临时密钥
    // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
    // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
    // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048

    const url = '/api/cos/sts'; // url 替换成您自己的后端服务
    const xhr = new XMLHttpRequest();

    let data = null;
    let credentials = null;
    xhr.open('GET', url, true);
    // xhr增加header
    xhr.setRequestHeader(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    xhr.onload = function (e) {
      try {
        data = JSON.parse(e.target.responseText);
        credentials = data.credentials;
      } catch (e) {
        console.error('获取签名失败');
      }
      if (!data || !credentials) {
        // return console.error(
        //   'credentials invalid:\n' + JSON.stringify(data, null, 2)
        // );
        callback({});
        return;
        // throw new Error('credentials invalid:\n' + JSON.stringify(data, null, 2));
      }
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        SecurityToken: credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    };
    xhr.send();
  },
});

// 生成一个方法，根据时间生成一个字符串，包含年月日时分秒
function generateRandomString() {
  const date = new Date();
  const fullYear = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${fullYear}-${month}-${day}/${hour}-${minute}-${second}`;
}

const config = {
  bucket: 'photo-wall-1258918219',
  region: 'ap-nanjing',
};
const fileUpload = (fileObject, userName = '') => {
  return new Promise((resolve, reject) => {
    cos.uploadFile(
      {
        Bucket: config.bucket /* 填入您自己的存储桶，必须字段 */,
        Region: config.region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Key: `photo-wall/${userName}/${generateRandomString()}/${
          fileObject.name
        }` /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        Body: fileObject /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */,
        SliceSize:
          1024 * 1024 * 5 /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */,
        onTaskReady: function (taskId) {
          /* 非必须 */
          console.log(taskId);
        },
        onProgress: function (progressData) {
          /* 非必须 */
          console.log(JSON.stringify(progressData));
        },
        onFileFinish: function (err, data, options) {
          /* 非必须 */
          console.log(options.Key + '上传' + (err ? '失败' : '完成'));
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
        // 支持自定义headers 非必须
        Headers: {},
      },
      function (err, data) {
        console.log(err || data);
        if (err) {
          return reject(err);
        }
      }
    );
  });
};
export default fileUpload;
