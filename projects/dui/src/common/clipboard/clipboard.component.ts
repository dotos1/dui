import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'dui-copy-content-tooltip',
  template: `
        <span class='dui-copy-tooltip'>{{ placeholder|translate }} </span>
        `,
  styleUrls: ['./clipboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClipboardComponent implements OnInit {
  placeholder: string;

  ngOnInit() {
    this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
  }
}
