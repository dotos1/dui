import { EventEmitter } from '@angular/core';
import { FileSelectDirective } from './file-select.directive';

/**
 * b8c5e5c 复核:不绑 [uploader] 的用法(iotos file-input 只用 (onFileSelected))
 * 选了文件必须照样发 onFileSelected。
 */
describe('FileSelectDirective.readFiles(b8c5e5c 复核)', () => {
  it('没有 uploader 时仍发 onFileSelected', async () => {
    const file = new File(['x'], 'a.txt', { type: 'text/plain' });
    const self: any = Object.create(FileSelectDirective.prototype);
    self.element = { nativeElement: { files: [file], attributes: {}, value: '' } };
    self.uploader = undefined;
    self.onFileSelected = new EventEmitter();
    self.imageSelected = new EventEmitter();
    self.imageFileProcessors = [];
    self._multiple = false;
    const got: any[] = [];
    self.onFileSelected.subscribe((v: any) => got.push(v));
    await self.readFiles({ target: { files: [file] } }).catch(() => {});
    expect(got).toEqual([file]);
  });
});
