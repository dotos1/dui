import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'window-dialog',
  templateUrl: './window-dialog.component.html',
  styleUrls: ['./window-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class WindowDialogComponent {
  @Input() toolbarColor?: ThemePalette;
  @Input() docked? = false;

  @Input() title?: string;
  @Input() toggleDockedStateLabel?: string;
  @Input() closeLabel?: string;

  @Output() dockToggled: EventEmitter<boolean> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();

  toolbarHeight = 56;

  toggleDockedState(): void {
    this.dockToggled.emit(this.docked);
  }
}
