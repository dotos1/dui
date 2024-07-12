
import { Component, Input } from '@angular/core';
import { DEFAULT_SEPARATOR } from '../card-view-textitem/card-view-textitem.component';
import { CardViewItem } from '../../interfaces';

@Component({
  selector: 'dui-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent {
  /** (**required**) Items to show in the card view. */
  @Input()
  properties: CardViewItem[];

  /** Toggles whether or not the items can be edited. */
  @Input()
  editable: boolean;

  /** Toggles whether or not to show empty items in non-editable mode. */
  @Input()
  displayEmpty: boolean = true;

  /** Toggles whether or not to display none option. */
  @Input()
  displayNoneOption: boolean = true;

  /** Toggles whether or not to display clear action. */
  @Input()
  displayClearAction: boolean = true;

  /** Toggles whether or not to enable copy to clipboard action. */
  @Input()
  copyToClipboardAction: boolean = true;

  /** Toggles whether or not to enable chips for multivalued properties. */
  @Input()
  useChipsForMultiValueProperty: boolean = true;


  @Input()
  multiValueSeparator: string = DEFAULT_SEPARATOR;
}
