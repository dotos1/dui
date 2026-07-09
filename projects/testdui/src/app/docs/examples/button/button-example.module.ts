import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from '@dotos/dui/ui/button';

@Component({
  selector: 'app-button-example',
  template: `
    <h2>按钮示例</h2>
    <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px;">
      <dui-button type="mat-raised-button" color="primary" text="主要按钮" (click)="log('主要按钮')"></dui-button>
      <dui-button type="mat-button" text="文本按钮" (click)="log('文本按钮')"></dui-button>
      <dui-button type="mat-icon-button" icon="favorite" (click)="log('图标按钮')"></dui-button>
    </div>
    <p>最近点击：{{ lastClicked || '（尚未点击）' }}</p>
  `,
})
export class ButtonExampleComponent {
  lastClicked = '';
  log(label: string): void {
    this.lastClicked = label;
  }
}

const routes: Routes = [{ path: '', component: ButtonExampleComponent }];

@NgModule({
  declarations: [ButtonExampleComponent],
  imports: [CommonModule, ButtonModule, RouterModule.forChild(routes)],
})
export class ButtonExampleModule {}
