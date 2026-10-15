import { firstValueFrom } from 'rxjs';
import { FieldSelect } from './select.field';
import { SelectOptionsPipe } from '../base/select-options.pipe';

/**
 * b8c5e5c 复核的回归用例。不起 TestBed:直接拿原型方法、配一个最小的 this,
 * 只验证被改坏的那一段逻辑。
 */
function fakeSelect(field: any, extra: any = {}): any {
  const self: any = Object.create(FieldSelect.prototype);
  Object.defineProperty(self, 'field', { value: field, writable: true });
  self.changeDetector = { detectChanges: () => {} };
  Object.assign(self, extra);
  return self;
}

describe('FieldSelect(b8c5e5c 复核)', () => {

  describe('远程:面板关着时主动 searchChange(\'\') 仍要拉选项', () => {
    // 主应用 widget.input.ts:下拉框里新建记录后
    //   parent.searchChange(''); parent.formControl.setValue(val)
    // 这时面板是关着的。
    it('发出不带过滤词的请求', () => {
      const getOptions = jasmine.createSpy('getOptions');
      const self = fakeSelect(
        { remote: true, params: { a: 1 }, dataSource: { url: '/api/opts', method: 'POST' } },
        { matSelect: { panelOpen: false }, optionService: { getOptions } },
      );
      self.searchChange('');
      expect(getOptions).toHaveBeenCalledTimes(1);
      expect(getOptions.calls.mostRecent().args[2]).toEqual({ a: 1, $filter: '' });
    });
  });

  describe('本地搜索按 labelProp 取标签', () => {
    const raw = [
      { text: '北京坐标系', id: 'BJ54' },
      { text: '西安坐标系', id: 'XA80' },
    ];

    it('labelProp: text 时按标签能搜到', () => {
      const field: any = { remote: false, labelProp: 'text', valueProp: 'id', options: raw };
      const self = fakeSelect(field, { options: raw });
      self.searchChange('西安');
      expect(field.options.map((o: any) => o.id)).toEqual(['XA80']);
    });

    it('按 value 照样能搜到', () => {
      const field: any = { remote: false, labelProp: 'text', valueProp: 'id', options: raw };
      const self = fakeSelect(field, { options: raw });
      self.searchChange('bj54');
      expect(field.options.map((o: any) => o.id)).toEqual(['BJ54']);
    });

    it('labelProp 为函数时也能搜到', () => {
      const field: any = { remote: false, labelProp: (o: any) => o.text + '!', options: raw };
      const self = fakeSelect(field, { options: raw });
      self.searchChange('北京坐标系!');
      expect(field.options.length).toBe(1);
    });

    it('管道不改原始选项对象', async () => {
      const item = { text: 'A', id: 1 };
      const out = await firstValueFrom(new SelectOptionsPipe().transform([item], { labelProp: 'text', valueProp: 'id' } as any));
      expect(out[0].label).toBe('A');
      expect(out[0].value).toBe(1);
      expect((item as any).label).toBeUndefined();
    });
  });
});
