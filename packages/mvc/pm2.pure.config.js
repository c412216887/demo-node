/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-11-05 17:32:30
 * @LastEditTime: 2022-11-12 13:25:02
 * @FilePath: \demo-node\packages\mvc\pure\pm2.config.js
 */
module.exports = {
  apps: [
    {
      name: "restful",
      script: "./pure/restful/index.ts",
      exec_mode: "cluster",
      instances: 1,
      env_development: {
        NODE_ENV: "development",
        watch: true
      },
      env_production: {
        NODE_ENV: "production",
        watch: false
      },
      log_date_format: "yyyy-MM-dd HH:mm Z",
      error_file: "./data/err.log",
      out_file: "./data/info.log",
      max_restarts: 10
    },
    {
      name: "@pure/api-server",
      script: "./pure/api-server/index.ts",
      exec_mode: "cluster",
      instance: 1,
      env_development: {
        NODE_ENV: "development",
        watch: true
      },
      env_production: {
        NODE_ENV: "production",
        watch: false
      },
      log_date_format: "YYYY-MM-dd HH:mm Z",
      error_file: "./data/err.log",
      out_file: "./data/info.log",
      max_restarts: 10
    }
  ]
}