/*
 * @LastEditors: chenlu chenlu0917boy@163.com
 * @Date: 2022-10-20 17:53:06
 * @LastEditTime: 2022-10-20 17:59:20
 * @FilePath: \demo-node\log\src\controller\content.ts
 */
import Controller from "../core/controller";
class Content extends Controller {
  log() {
    this.ctx.log.info("test", `good success ${Math.random()}`);
    return this.setRes(true, "log success");
  }
}

export default Content;
