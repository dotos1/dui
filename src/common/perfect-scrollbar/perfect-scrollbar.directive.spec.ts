/**
 * @fileoverview Module `src/common/perfect-scrollbar/perfect-scrollbar.directive.spec.ts` providing perfect scrollbar directive spec definitions and implementation.
 * @zh 模块文件 `src/common/perfect-scrollbar/perfect-scrollbar.directive.spec.ts`，提供perfect滚动条指令spec相关的定义与实现。
 */

import { ElementRef, KeyValueDiffers, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';

/**
 * b8c5e5c 复核:重新 init(config 变化 / disabled 切回 false)后再销毁,
 * 这一轮绑的滚动事件监听必须解掉。Subject complete 之后 closed 仍是 false,
 * 要看 isStopped。
 */
describe('PerfectScrollbarDirective 重新 init 后销毁(b8c5e5c 复核)', () => {
  it('销毁后不再转发 ps-scroll-y', async () => {
    const el = document.createElement('div');
    el.style.cssText = 'height:50px;overflow:hidden';
    el.innerHTML = '<div style="height:500px"></div>';
    document.body.appendChild(el);
    const dir = new PerfectScrollbarDirective(
      TestBed.inject(NgZone), TestBed.inject(KeyValueDiffers), new ElementRef(el), 'browser', null as any);
    let n = 0;
    dir.psScrollY.subscribe(() => n++);

    dir.ngOnInit();
    (dir as any).destroyScrollbar();
    dir.ngOnInit();            // 第二轮
    dir.ngOnDestroy();

    el.dispatchEvent(new Event('ps-scroll-y'));
    await new Promise((r) => setTimeout(r, 60));   // 监听带 auditTime(20)
    expect(n).toBe(0);
    el.remove();
  });
});
