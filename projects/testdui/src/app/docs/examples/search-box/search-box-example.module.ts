import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBoxModule } from '@dotos/dui/common/search-box';

@Component({
  selector: 'app-search-box-example',
  template: `
    <h2>搜索框示例</h2>
    <search-box style="display:block; max-width:320px;" placeholder="输入关键字搜索..."
      (onSearch)="lastSearch = $event" (onClear)="lastSearch = ''"></search-box>
    <p style="margin-top:12px;">当前搜索词：{{ lastSearch || '（空）' }}</p>
  `,
})
export class SearchBoxExampleComponent {
  lastSearch = '';
}

const routes: Routes = [{ path: '', component: SearchBoxExampleComponent }];

@NgModule({
  declarations: [SearchBoxExampleComponent],
  imports: [CommonModule, SearchBoxModule, RouterModule.forChild(routes)],
})
export class SearchBoxExampleModule {}
