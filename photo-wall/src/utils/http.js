// http.js

// 生成随机字符串
function generateRandomString() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 从本地存储中读取 userId
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateRandomString();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// 封装 Fetch 请求
function http(url, options) {
  let token = window.localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
  options.headers = options.headers
    ? { ...options.headers, ...defaultOptions.headers }
    : defaultOptions.headers;
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('请求出错:', error);
      throw error;
    });
}

// 导出 http 函数和 getUserId 方法
export { http, getUserId };
