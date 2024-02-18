# TDesign+COS 实战开发移动端在线相册应用
本项目前端选择了TDesign Mobile+Vue3，实现注册、登录、上传图片、看图片，并且支持移动端浏览器访问。

后端采用了Node.js+数据库。数据库用于记录ID等COS文件信息。图片的raw data通过COSClient SDK存入COS桶中。

# 项目结构
photo-wall  前端代码

photo-wall-node 后端代码


# 启动步骤
- photo-wall  
使用 npm run serve 会启动8081端口，/api代理到 http://localhost:3000
- photo-wall-node  
npm run dev 会启动3000端口，有需要可以自己改