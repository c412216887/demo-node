/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-18 17:29:47
 * @LastEditTime: 2022-10-30 21:18:08
 * @FilePath: \demo-node\log\src\lib\log.ts
 */
import fs, { promises as fsPromise } from "node:fs";
import path from "node:path";

const cacheLogStr: Record<string, string> = {}; // 缓存
const fileStreams: Record<string, fs.WriteStream> = {}; // 存放文件流
const logFilePath = path.resolve(`${__dirname}`, "../../log");

class Log {
  cacheEnable: boolean; // 日志缓存是否开启
  cacheTime: number; // 自动写日志，计时器启动等待时间， 默认 2 秒
  maxLen: number; // 单个日志文件最大缓存长度，默认 100000
  maxFileStream: number; // 最大缓存文件流数， 默认 1000
  currentFileStreamNum: number; // 当前文件流数， 初始值为 0
  constructor(
    cacheEnable: boolean = true,
    cacheTime: number = 2000,
    maxLen: number = 100000,
    maxFileStream: number = 1000
  ) {
    this.cacheTime = cacheTime;
    this.maxLen = maxLen;
    this.cacheEnable = cacheEnable;
    this.maxFileStream = maxFileStream;
    this.currentFileStreamNum = 0;
  }
  /**
   * 启动日志定时写入
   */
  start() {
    this._intervalWrite();
  }
  /**
   * 写入日志
   * @param fileType 日志模块
   * @param logInfo 日志信息
   * @returns
   */
  info(fileType: string, logInfo: string) {
    if (!fileType || !logInfo) {
      return;
    }
    this._flush(fileType, logInfo);
  }
  /**
   * 定时写入日志
   */
  _intervalWrite() {
    setInterval(() => {
      const fileTypes = Object.keys(cacheLogStr);
      if (fileTypes.length < 1) {
        // 空数据不处理
        return;
      }
      for (const fileType of fileTypes) {
        if (fileType === "") {
          // 空数据，清理句柄
          this._clean(fileType).then();
          continue;
        }
        // 写入日志，写入完成后，需要清理当前日志缓存，注意这里可能会导致日志丢失
        this._addLog(fileType, cacheLogStr[fileType]).then(() => {
          cacheLogStr[fileType] = "";
        });
      }
    }, this.cacheTime);
  }
  _flush(fileType: string, logInfo: string) {
    if (!fileType) {
      // 参数校验
      return;
    }
    let logStr = logInfo;
    if (typeof logInfo === "object") {
      logStr = JSON.stringify(logInfo);
    }
    if (logStr === "" || !logStr) {
      return;
    }
    if (!this.cacheEnable) {
      // 缓存关闭，直接写日志
      return this._addLog(fileType, cacheLogStr[fileType]);
    }
    if (!cacheLogStr[fileType]) {
      // 判断是否已经有缓存
      return (cacheLogStr[fileType] = `${logStr}`);
    }
    if (cacheLogStr[fileType].length < this.maxLen) {
      return (cacheLogStr[fileType] = `${cacheLogStr[fileType]}\n${logStr}`);
    } else {
      // 如果超过最大长度，直接写入日志
      return this._addLog(fileType, cacheLogStr[fileType]);
    }
  }
  async _addLog(fileType: string, data: string) {
    const fileStream = await this._getFileStream(fileType);
    fileStream.write(`${data}`, "utf-8");
  }
  async _getFileStream(fileType: string): Promise<fs.WriteStream> {
    if (fileStreams[fileType]) {
      return fileStreams[fileType];
    }
    const filePath = this._getFilePath(fileType);
    await fsPromise.stat(filePath).catch((err: Error) => {
      fs.writeFileSync(filePath, "");
    });
    const fileStream: fs.WriteStream = fs.createWriteStream(filePath, {
      encoding: "utf-8",
      flags: "a",
    });
    if (this.currentFileStreamNum > this.maxFileStream) {
      this.currentFileStreamNum++;
      return (fileStreams[fileType] = fileStream);
    }
    return fileStream;
  }
  _getFilePath(fileType: string) {
    return path.resolve(logFilePath, `./${fileType}.log`);
  }
  async _clean(fileType: string) {
    let fileStream = await this._getFileStream(fileType);
    delete cacheLogStr[fileType];
    delete cacheLogStr[fileType];

    this.currentFileStreamNum--;
    if (!fileStream) {
      return;
    }
    fileStream.end();
  }
}

export default Log;
