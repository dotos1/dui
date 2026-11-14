/**
 * @fileoverview Module `src/form/array-input/array-input.component.ts` providing array input component definitions and implementation.
 * @zh 模块文件 `src/form/array-input/array-input.component.ts`，提供数组输入属性组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import {clone}  from 'lodash-es';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TextFieldComponent } from '../field';

/**
 * Angular component `ArrayInputComponent` (selector: 'array-input-field') providing array input component presentation and interaction in `src/form/array-input`.
 * @zh Angular 组件 `ArrayInputComponent`（selector: 'array-input-field'），提供数组输入属性组件的视图渲染与交互逻辑（位于 `src/form/array-input`）。
 */
@Component({
  selector: 'array-input-field',
  templateUrl: './array-input.component.html',
  styleUrls: ['./array-input.component.scss'],
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: ArrayInputComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'array-input-field' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class ArrayInputComponent extends TextFieldComponent implements OnInit {

  /**
   * Output event emitter `result` (`EventEmitter<{ key: string; data: string; }>`) firing when result occurs.
   * @zh 输出事件 `result`（类型：`EventEmitter<{ key: string; data: string; }>`），当触发结果时向外发出事件。
   */
  @Output() result = new EventEmitter<{ key: string, data: string }>();

  /**
   * Property `selectData` (`any[]`) storing select data (default: `[]`).
   * @zh 属性 `selectData`（类型：`any[]`），用于存储或配置下拉选择数据（默认值：`[]`）。
   */
  selectData = [];
  /**
   * Property `filteredData` (`any`) storing filtered data.
   * @zh 属性 `filteredData`（类型：`any`），用于存储或配置已过滤数据。
   */
  filteredData;
  /**
   * Property `filterString` (`string`) storing filter string (default: `''`).
   * @zh 属性 `filterString`（类型：`string`），用于存储或配置过滤字符串（默认值：`''`）。
   */
  filterString: string = '';

  
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit(): void {
    super.ngOnInit();

    this.selectData=[];
     this.formControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((val) => {
      // startWith<string>(''),
      // map(value => typeof value === 'string' ? value : this.filterString),
     // map((filter:any) =>{
        this.filteredData =of(this.filter(val));
        this.changeDetector.detectChanges();
      } 
    );    
  }

  /**
   * Property `filter` (`(filter: string) => any`) storing filter.
   * @zh 属性 `filter`（类型：`(filter: string) => any`），用于存储或配置过滤。
   */
  filter = (filter: string) => {
    this.filterString = filter;
    this.selectData=[];
    if(this.field.options==undefined){
      return [];
    }
    let opts = this.field.options.map(o => ({ ...o, selected: false }));
    if (filter && filter.length > 0) {
      const selectedValues = String(filter).split(',').map(s => s.trim());
      opts.forEach(option => {
        let seleted = selectedValues.includes(String(option.value));
        option["selected"] = seleted;
        if (seleted) {
          this.selectData.push(option);
        }
      });

      return opts;
    } else {
      return opts.slice();
    }
  };
  
  /**
   * Executes `openChanged` to handle open changed.
   * @zh 执行 `openChanged`，用于打开已变更。
   */
  override openChanged() {
    let value=this.formControl.value;
    this.filteredData=of(this.filter(value));
  }

  /**
   * Property `displayFn` (`() => string`) storing display fn (default: `(): string => ''`).
   * @zh 属性 `displayFn`（类型：`() => string`），用于存储或配置display函数（默认值：`(): string => ''`）。
   */
  displayFn = (): string => '';

  /**
   * Property `optionClicked` (`(event: Event, data: any) => void`) storing option clicked.
   * @zh 属性 `optionClicked`（类型：`(event: Event, data: any) => void`），用于存储或配置选项点击。
   */
  optionClicked = (event: Event, data): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  /**
   * Property `toggleSelection` (`(data: any) => void`) storing toggle selection.
   * @zh 属性 `toggleSelection`（类型：`(data: any) => void`），用于存储或配置开关Selection。
   */
  toggleSelection = (data): void => {
    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectData.push(data);
    } else {
      const i = this.selectData.findIndex(val =>val.value === data.value);
      this.selectData.splice(i, 1);
    }
    this.emitAdjustedData();
  };

  /**
   * Property `emitAdjustedData` (`() => void`) storing emit adjusted data.
   * @zh 属性 `emitAdjustedData`（类型：`() => void`），用于存储或配置发出Adjusted数据。
   */
  emitAdjustedData = (): void => {
    const results: Array<string> = []
    this.selectData.forEach((data: { value? }) => {
      results.push(data.value);
    });

    this.formControl.setValue(results.join(','));

    this.result.emit({ key: this.field.name, data: results.join(',') });
  };

  /**
   * Property `removeChip` (`(data: any) => void`) storing remove chip.
   * @zh 属性 `removeChip`（类型：`(data: any) => void`），用于存储或配置移除纸片标签。
   */
  removeChip = (data): void => {
    this.toggleSelection(data);
  };
}
