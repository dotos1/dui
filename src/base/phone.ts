/**
 * @fileoverview 手机终端判定与手机专用的小工具（施工图 M2-10 / M2-13 / M2-15）。
 * @zh 手机类判定：根元素带 `is-phone`（由应用的 ViewportService 按真实设备判定后设置，桌面窄窗口不是手机）。
 * dui 控件里所有手机专属行为都以这里为准，桌面（无此类）走原逻辑，一行不变。
 */

/**
 * Whether the current terminal is a phone (root element has the `is-phone` class).
 * @zh 当前终端是否手机（根元素带 `is-phone` 类）。服务端渲染或无 document 时为 false。
 */
export function isPhoneTerminal(): boolean {
  return typeof document !== 'undefined' && !!document.documentElement && document.documentElement.classList.contains('is-phone');
}

/** 手机下弹层打开期间，系统返回键关弹层而不是退页面：压入一条同地址历史，popstate 时关，主动关时退回这一条。 */
export interface PhoneBackGuard {
  /** 弹层已被别的途径关掉时调用：把压入的历史退掉 */
  release(): void;
}

// 弹层可以嵌套（全屏编辑层里再开选择页），所以是一个栈：一次返回只关最上面那层；
// 主动关闭时 history.back() 引发的那次 popstate 不能再关下面一层。
const stack: Array<{ close: () => void }> = [];
let skipPops = 0;
let listening = false;

function onPopState(): void {
  if (skipPops > 0) {
    skipPops--;
    return;
  }
  stack.pop()?.close();
}

/**
 * Pushes a same-URL history entry so the system back key closes an overlay instead of leaving the page.
 * @zh 压入一条同地址历史，让系统返回键关闭最上面的弹层而不是离开页面；桌面不调用。
 * @param close - 收到返回时要做的关闭动作
 * @returns 守卫；弹层被其他途径关掉时调用 `release()`
 */
export function guardPhoneBack(close: () => void): PhoneBackGuard {
  if (!listening) {
    listening = true;
    window.addEventListener('popstate', onPopState);
  }
  const entry = { close };
  stack.push(entry);
  window.history.pushState(window.history.state, '');
  return {
    release() {
      const i = stack.indexOf(entry);
      if (i < 0) {
        return; // 已经是返回键关的
      }
      stack.splice(i, 1);
      skipPops++;
      window.history.back();
    },
  };
}
