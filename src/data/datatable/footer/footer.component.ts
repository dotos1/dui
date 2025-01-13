import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { DatatableFooterDirective } from './footer.directive';
import { DuiPagingBarComponent } from '@dotos/dui/data/paging';
import { MediaService } from '@dotos/dui/common/media';

@Component({
  selector: 'datatable-footer',
  templateUrl: 'footer.component.html',
  host: {
    class: 'datatable-footer'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableFooterComponent {
  @Input() footerHeight: number;
  @Input() rowCount: number;
  @Input() pageSize: number;
  @Input() offset: number;
  @Input() totalMessage: string;
  @Input() footerTemplate: DatatableFooterDirective;
  @Input() pagingConfig: any;
  @Input() selectedCount: number = 0;
  @Input() selectedMessage: string | boolean;

  @Output() page: EventEmitter<any> = new EventEmitter();


  @ViewChild(DuiPagingBarComponent)
  paging: DuiPagingBarComponent;

  constructor(
    public media: MediaService) {
  }

  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  get curPage(): number {
    return this.offset + 1;
  }
}
