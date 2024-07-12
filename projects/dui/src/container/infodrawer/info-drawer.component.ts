
import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'dui-info-drawer-tab',
  template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class InfoDrawerTabComponent {

  @Input()
  label: string = '';

  @Input()
  icon: string = null;

  @ViewChild(TemplateRef)
  content: TemplateRef<any>;
}

@Component({
  selector: 'dui-info-drawer',
  templateUrl: './info-drawer.component.html',
  styleUrls: ['./info-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'dui-info-drawer' }
})
export class InfoDrawerComponent {
  /** The title of the info drawer (string or translation key). */
  @Input()
  title: string | null = null;

  /** The selected index tab. */
  @Input()
  selectedIndex: number = 0;

  /** Emitted when the currently active tab changes. */
  @Output()
  currentTab: EventEmitter<number> = new EventEmitter<number>();


  /** Emitted when the currently active tab changes. */
  @Output()
  onClose: EventEmitter<void> = new EventEmitter<void>();

  @ContentChildren(InfoDrawerTabComponent)
  contentBlocks: QueryList<InfoDrawerTabComponent>;

  showTabLayout(): boolean {
    return this.contentBlocks.length > 0;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.currentTab.emit(event.index);
  }
  close() {
    this.onClose.emit();
  }
}
