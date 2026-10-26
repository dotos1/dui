/**
 * @fileoverview Module `src/ux/line-style/linesize.spec.ts` providing linesize spec definitions and implementation.
 * @zh 模块文件 `src/ux/line-style/linesize.spec.ts`，提供linesizespec相关的定义与实现。
 */

import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { LineSizeSelector } from './linesize';
import { LineStyleSelector } from './linestyle';

/**
 * b8c5e5c 复核:外部用 setValue(v, { emitEvent: false }) 回填时也要重绘;
 * 销毁后回调要解绑。
 */
[['LineSizeSelector', LineSizeSelector], ['LineStyleSelector', LineStyleSelector]].forEach(([name, Cls]: any) => {
  describe(`${name} 跟随 formControl(b8c5e5c 复核)`, () => {
    function make() {
      const self: any = Object.create(Cls.prototype);
      self.onDestroy$ = new Subject<void>();
      self.setValue = jasmine.createSpy('setValue');
      const setter = Object.getOwnPropertyDescriptor(Cls.prototype, 'field')!.set!;
      const control = new FormControl<any>(null);
      setter.call(self, { formControl: control });
      return { self, control };
    }

    it('emitEvent:false 写值时也重绘', () => {
      const { self, control } = make();
      control.setValue(3, { emitEvent: false });
      expect(self.setValue).toHaveBeenCalledWith(3);
    });

    it('换 field 之后旧 control 的回调解绑', () => {
      const { self, control } = make();
      const setter = Object.getOwnPropertyDescriptor(Cls.prototype, 'field')!.set!;
      setter.call(self, { formControl: new FormControl<any>(null) });
      self.setValue.calls.reset();
      control.setValue(5);
      expect(self.setValue).not.toHaveBeenCalled();
    });
  });
});
