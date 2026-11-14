/**
 * @fileoverview Module `projects/testdui/src/app/color/testcolor.component.ts` providing testcolor component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/color/testcolor.component.ts`，提供testcolor组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { FormComponent } from "@dotos/dui/form";

/**
 * Angular component `TestColorComponent` (selector: 'test-color') providing test color component presentation and interaction in `projects/testdui/src/app/color`.
 * @zh Angular 组件 `TestColorComponent`（selector: 'test-color'），提供测试颜色组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/color`）。
 */
@Component({
    selector: 'test-color',
    template: `
        <dui-form #iconForm  [config]="iconFormConfig" style="width:100%"></dui-form>
     `,
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
  })
export class TestColorComponent {
    /**
     * Template/content query reference `commonForm` (`@ViewChild`) targeting common form.
     * @zh 模板/内容视图查询引用 `commonForm`（`@ViewChild`），指向通用表单。
     */
    @ViewChild('commonForm', { static: false }) commonForm: FormComponent;
    /**
     * Property `iconFormConfig` (`any`) storing icon form config.
     * @zh 属性 `iconFormConfig`（类型：`any`），用于存储或配置图标表单配置。
     */
    iconFormConfig = {
        items: [
            {
                name: 'color',
                label: '颜色',
                colorType: 'sketch',
                wrappers: ['form-field'],
                flex:  50,
                openOnFocus: true,
                defaultValue: '#00FF00',
                xtype: 'color-picker-field'
              },
              { 
                xtype: 'icon-picker-field',
                label: 'GIS.STYLE.ICON',
                name: 'icon',
                allow: ['font', 'custom'],
                custompath: 'marker',
                fontpath: 'map/font',
                required: true,
                wrappers: ['form-field'],
                flex: 100
              },
              {
                xtype: 'icon-picker-field',
                label: 'TOPMENU.ICON',
                name: 'icon_url',
                required: false,
                allow:['material','svg'],
                iconpath:'svgicon',
                wrappers: ['form-field'],
                flex: 25,
             },
             { 
              xtype: 'icon-picker-field',
              label: 'GIS.STYLE.ICON',
              name: 'icon_font',
              allow: ['font', 'custom','material','svg'],
              custompath: 'marker',
              fontpath: 'map/font',
              iconpath:'svgicon',
              required: true,
              wrappers: ['form-field'],
              flex: 100
            },
        ]
    }
}
