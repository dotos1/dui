/**
 * 一个快捷键命令出错,不能让其余快捷键失效。
 *
 * 命令在键盘事件流的 tap 里调用;原来异常直接冒出去(外加 catchError 原样再抛),
 * 订阅终止 —— 此后所有快捷键都没反应,直到刷新页面,控制台里只有一条与它们无关的报错。
 */
import { KeyboardShortcutsService } from './keyboard-shortcuts.service';
import { runShortcutCommand } from './utils';

function keydown(key: string, keyCode: number) {
    const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    Object.defineProperty(e, 'keyCode', { get: () => keyCode });
    Object.defineProperty(e, 'which', { get: () => keyCode });
    document.body.dispatchEvent(e); // 真实按键的 target 是页面元素,冒泡到 document
    document.body.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true }));
}

describe('KeyboardShortcutsService 命令出错', () => {
    let service: KeyboardShortcutsService;
    let errors: unknown[];
    let consoleError: jasmine.Spy;

    beforeEach(() => {
        errors = [];
        consoleError = spyOn(console, 'error').and.callFake((...args: unknown[]) => errors.push(args));
        service = new KeyboardShortcutsService(document);
    });

    afterEach(() => service.ngOnDestroy());

    it('一个命令抛错后,其余组合键照常触发,且错误被记录', () => {
        let fired = 0;
        service.add([
            { key: 'f8', command: () => { throw new Error('boom'); } },
            { key: 'f9', command: () => fired++ },
        ] as any);

        keydown('F8', 119);
        keydown('F9', 120);
        keydown('F8', 119);
        keydown('F9', 120);

        expect(fired).toBe(2);
        expect(consoleError).toHaveBeenCalled();
    });

    it('runShortcutCommand:命令正常返回 true,抛错返回 false 并交给 onError', () => {
        const seen: unknown[] = [];
        expect(runShortcutCommand(() => undefined, {}, (e) => seen.push(e))).toBe(true);
        expect(runShortcutCommand(() => { throw new Error('x'); }, {}, (e) => seen.push(e))).toBe(false);
        expect(seen.length).toBe(1);
    });
});
