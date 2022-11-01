/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-11-01 10:27:57
 * @LastEditTime: 2022-11-01 10:49:34
 * @FilePath: \demo-node\cache\pm2.config.js
 */
module.exports = {
  app: [
    {
      name: "nodejs-cache", // 进程名称
      script: "./app.js", // 启动的脚本
      instances: 1, // 启动的进程数
      exec_mode: "cluster", // 多进程多实例
      env_development: {
        NODE_ENV: "development",
        watch: true
      },
      log_date_format: "yyyy-MM-dd HH:mm Z",
      error_file: "~/data/nodejs-cache/err.log",
      out_file: "~/data/nodejs-cache/info.log",
      max_restarts: 10
    }
  ]
}