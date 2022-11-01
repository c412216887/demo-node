module.exports = {
  apps: [
    {
      name: "pm2",
      script: "./app.ts",
      instances: 2,
      exec_mode: "cluster",
      env_development: {
        NODE_ENV: "development",
        watch: true,
      },
      env_testing: {
        NODE_ENV: "testing",
        watch: false,
      },
      env_production: {
        NODE_ENV: "production",
        watch: false,
      },
      log_date_format: "yyyy-MM-DD HH:MM Z",
      error_file: "./data/err.log",
      out_file: "./data/info.log",
      max_restarts: 10,
    },
  ],
};
