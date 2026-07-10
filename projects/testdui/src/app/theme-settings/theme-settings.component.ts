import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss'],
})
export class ThemeSettingsComponent implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<void>();

  readonly form: FormGroup;

  readonly themeTypes: SelectOption[] = [
    { value: 'light', label: '浅色 Light' },
    { value: 'dark', label: '深色 Dark' },
    { value: 'darkblue', label: '深蓝 Dark Blue' },
  ];

  readonly formTypes: SelectOption[] = [
    { value: 'fill', label: '填充 Fill' },
    { value: 'outline', label: '描边 Outline' },
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dotosConfigService: DotosConfigService,
    public themeService: ThemeService
  ) {
    this.form = fb.group({
      type: ['light'],
      primary: ['blue-500'],
      accent: ['orange-500'],
      warn: ['red-800'],
      formType: ['fill'],
    });
  }

  ngOnInit(): void {
    this.dotosConfigService.config.pipe(takeUntil(this.destroy$)).subscribe((config: any) => {
      this.form.patchValue(config.theme, { emitEvent: false });
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.dotosConfigService.config = { theme };
    });
  }

  reset(): void {
    this.dotosConfigService.resetToDefaults();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
