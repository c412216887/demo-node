/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-18 17:15:34
 * @LastEditTime: 2022-10-18 17:23:45
 * @FilePath: \demo-node\log\pm2.config.js
 */
module.exports = {
  apps: [
    {
      name: "log",  // 启动进程名
      script: "./index.ts", // 启动文件
      instances: 1, // 启动进程数
      exec_mode: 'cluster', // 多进程多实例
      env_development: {
        NODE_ENV: "development",
        watch: false, // 开发环境使用true, 其他必须设置为false
      },
      env_testing: {
        NODE_ENV: "testing",
        watch: false
      },
      env_production: {
        NODE_ENV: "production",
        watch: false
      },
      log_date_format: 'yyyy-MM-dd HH:mm Z',
      error_file: './data/err.log', // 错误日志文件， 必须设置在项目外的目录
      out_file: './data/info.log', // 流水日志，包括console.log日志，必须设置在项目外的目录
      max_restarts: 10
    }
  ]
}