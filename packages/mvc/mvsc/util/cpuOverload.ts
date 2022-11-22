/*
 * @Author: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-14 09:47:04
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @LastEditTime: 2022-10-18 13:30:04
 * @FilePath: \demo-node\mvc\mvsc\util\cpuOverload.ts
 */

import { exec } from "node:child_process";
import os, { cpus } from "node:os";
import util from "node:util";
import { platform } from "node:process";

const canAccessList: boolean[] = [];
const maxUser = 5000;
// cpu是否超载
let isOverload: boolean = false;
let overloadTimes: number = 0;
let currentProbability = 0;
let currentCpuPercentage = 0;
let removeCount = 0; // 丢弃数量
const maxValue = 10 * Math.exp(10);
class CpuOverload {
  whiteList: string[];
  maxCpuPercentage: number;
  maxOverloadNum: number;
  baseProbability: number;
  constructor(
    maxOverloadNum: number,
    maxCpuPercentage: number,
    baseProbability: number,
    whiteList: string[] = []
  ) {
    this.whiteList = whiteList;
    this.maxCpuPercentage = maxCpuPercentage;
    this.baseProbability = baseProbability;
    this.maxOverloadNum = maxOverloadNum;
  }
  /**
   * 判断服务器当前是否可用
   * @param {string} path
   */
  isAvailable(path: string, uuid: boolean = false) {
    // 判断是否在白名单
    if (path && this.whiteList.includes(path)) {
      return true;
    }
    // 判断是否已经放行过
    if (uuid && canAccessList.includes(uuid)) {
      return true;
    }
    if (isOverload) {
      if (this._getRandomNum() <= currentProbability) {
        removeCount++;
        return false;
      }
    }
    if (uuid) {
      // 需要将uuid加入到放行数组
      if (canAccessList.length > maxUser) {
        canAccessList.shift();
      }
      canAccessList.push(uuid);
    }
  }
  async check() {
    setInterval(async () => {
      const cpuInfo: number = Number(await this._getProcessInfo());
      if (!cpuInfo) {
        return;
      }
      currentCpuPercentage = cpuInfo;
      // 当cpu过高时， 将当前overloadTimes计数+1
      if (cpuInfo > this.maxCpuPercentage) {
        overloadTimes++;
      } else {
        // 当低于cpu设定值时，则认为服务负载恢复，因此将overloadTimes设置为0
        overloadTimes = 0;
        return (isOverload = false);
      }
      // 当持续出现cpu过载时，并且达到我们设置上线，则需要进行请求丢弃了
      if (overloadTimes > this.maxOverloadNum) {
        isOverload = true;
      }
      this._getProbability();
    }, 2000);
  }
  /**
   * 获取进程信息
   * @returns {string} 进程信息
   */
  async _getProcessInfo(): Promise<string> {
    let pidInfo: string, cpuInfo;
    // 判断平台
    if (platform === "win32") {
      // windows 平台
      pidInfo = await this._getWmic();
    } else {
      // 其他平台 linux & mac
      pidInfo = await this._getPs();
    }
    cpuInfo = await this._parseInOs(pidInfo);
    if (!cpuInfo) {
      return "";
    }
    return parseFloat(cpuInfo).toFixed(4);
  }
  /**
   * 获取丢弃概率
   */
  _getProbability() {
    const o = Math.min(overloadTimes, 100);
    const c = Math.min(currentCpuPercentage, 100) / 10;
    currentProbability =
      ((0.1 * o * Math.exp(c)) / maxValue) * this.baseProbability;
  }
  /**
   * 使用ps命令获取process status
   * @returns {string} 进程信息
   */
  async _getPs(): Promise<string> {
    // 命令行
    const cmd = `ps -p ${process.pid} -o pcup`;
    // 执行结果
    const { stdout, stderr } = await util.promisify(exec)(cmd);
    if (stderr) {
      return "";
    }
    return stdout;
  }
  _parseInOs(pidInfo: string): string {
    let lines = pidInfo.trim().split(os.EOL);
    if (!lines || lines.length < 2) {
      return "";
    }
    let cpuStr = lines[1];
    return cpuStr.trim();
  }
  async _getWmic(): Promise<string> {
    return "";
  }
  _getRandomNum() {
    return Math.random();
  }
}

export default CpuOverload;
