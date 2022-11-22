/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-11-01 11:33:54
 * @LastEditTime: 2022-11-12 12:35:47
 * @FilePath: \demo-node\preinstall.js
 */
const process = require('node:process')

console.log(process.env.npm_execpath)
if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.log(`\u001b[33mThis repository requires using pnpm as the package manager ` +
    ` for scripts to work properly.\u001b[39m\n`)
  process.exit(1)
}