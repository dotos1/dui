import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorFieldModule, FormModule, FormWrapperModule } from '@dotos/dui/form';
import { LoadingModule, LoadingService } from '@dotos/dui/common/loading';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-form-example',
  template: `
    <h2>动态表单示例</h2>
    <dui-form [config]="formConfig" style="display:block; max-width:480px;"></dui-form>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class FormExampleComponent {
  formConfig = {
    items: [
      {
        xtype: 'select-field',
        name: 'level',
        label: '等级',
        wrappers: ['form-field'],
        options: [
          { value: 'low', label: '低' },
          { value: 'medium', label: '中' },
          { value: 'high', label: '高' },
        ],
        defaultValue: 'medium',
      },
      {
        xtype: 'color-picker-field',
        name: 'color',
        label: '颜色',
        colorType: 'sketch',
        wrappers: ['form-field'],
        defaultValue: '#2196F3',
      },
    ],
  };

  readonly exampleSource = `<dui-form [config]="formConfig"></dui-form>

formConfig = {
  items: [
    { xtype: 'select-field', name: 'level', label: '等级', options: [...] },
    { xtype: 'color-picker-field', name: 'color', label: '颜色', colorType: 'sketch' },
  ],
};`;
}

const routes: Routes = [{ path: '', component: FormExampleComponent }];

@NgModule({
  declarations: [FormExampleComponent],
  imports: [CommonModule, FormModule, FormWrapperModule, ColorFieldModule, LoadingModule, HighlightModule, RouterModule.forChild(routes)],
  providers: [LoadingService],
})
export class FormExampleModule {}
