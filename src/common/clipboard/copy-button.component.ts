
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { TooltipPosition } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';
import { ClipboardService } from './clipboard.service';
import { TranslateService } from '@dotos/dui/translator';
import { coerceBoolean } from '@dotos/dui/core/decorators';

@Component({
  selector: 'copy-button',
  styleUrls: ['copy-button.component.scss'],
  templateUrl: './copy-button.component.html'
})
export class CopyButtonComponent {

  private timer;

  copied = false;

  @Input()
  copyText: string;

  @Input()
  @coerceBoolean()
  disabled = false;

  @Input()
  icon: string;

  @Input()
  tooltipText: string;

  @Input()
  tooltipPosition: TooltipPosition;

  @Input()
  style: {[key: string]: any} = {};

  @Input()
  color: ThemePalette;

  @Input()
  @coerceBoolean()
  miniButton = true;

  @Output()
  successCopied = new EventEmitter<string>();

  constructor(private clipboardService: ClipboardService,
              private translate: TranslateService,
              private cd: ChangeDetectorRef) {
  }

  copy($event: Event): void {
    $event.stopPropagation();
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.clipboardService.copyContentToClipboard(this.copyText);
    this.successCopied.emit(this.copyText);
    this.copied = true;
    this.timer = setTimeout(() => {
      this.copied = false;
      this.cd.detectChanges();
    }, 1500);
  }

  get matTooltipText(): string {
    return this.copied ? this.translate.instant('ota-update.copied') : this.tooltipText;
  }

  get matTooltipPosition(): TooltipPosition {
    return this.copied ? 'below' : this.tooltipPosition;
  }

}
