import {  Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractPanel } from './abstract.panel';

@Component({
  selector: 'dui-panel',
  styleUrls: ['./panel.component.scss'],
  templateUrl: './panel.component.html',
  host: {
    '[style.flex]': 'flex'
  }
})
export class DuiPanelComponent  extends AbstractPanel  implements OnInit, OnDestroy {


}
