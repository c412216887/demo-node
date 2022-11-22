/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-08-04 19:54:00
 * @LastEditTime: 2022-11-05 17:20:32
 * @FilePath: \demo-node\packages\event-loop\index.ts
 */
import fs from "node:fs";
import process from "node:process";

fs.readFile("./index.txt", { encoding: "utf-8" }, (err, data) => {
  if (err) {
    console.log("3");
    throw err;
  }
  console.log("4");
});

setImmediate(() => {
  console.log("2");
});

setTimeout(() => {
  console.log("1");
}, 0);

Promise.resolve().then(() => {
  console.log("5");
});
process.nextTick(() => {
  console.log("7");
});
console.log("6");
