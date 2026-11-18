/**
 * @fileoverview Unit tests for W2 `@coerceBoolean()` with `useDefineForClassFields: false` across all 14 decorated fields in DUI.
 * @zh W2 `@coerceBoolean()` 装饰器与 `useDefineForClassFields: false` 语义恢复单元测试（覆盖全仓 14 处装饰器挂载点）。
 */

import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule, ClipboardService, CopyButtonComponent } from '../../common/clipboard/public-api';
import { ToggleHeaderComponent } from '../../form/toggle-select/toggle-header.component';
import { ToggleSelectComponent } from '../../form/toggle-select/toggle-select.component';
import { ToggleSelectModule } from '../../form/toggle-select/toggle-select.module';
import { TranslateModule } from '../../translator/public-api';
import { coerceBoolean } from './coercion';

class CustomCoerceDemo {
  @coerceBoolean()
  flagDefaultFalse = false;

  @coerceBoolean()
  flagDefaultTrue = true;

  @coerceBoolean()
  flagNoInit: boolean;
}

@Component({
  standalone: false,
  template: `
    <copy-button
      class="cb-host"
      [copyText]="'hello'"
      disabled="false"
      miniButton="false"
    ></copy-button>
    <toggle-select
      class="ts-host"
      disabled="false"
      disablePagination="false"
      fillHeight="false"
      extraPadding="false"
      primaryBackground="false"
    ></toggle-select>
    <toggle-header
      class="th-host"
      disablePagination="false"
      useSelectOnMdLg="false"
      ignoreMdLgSize="false"
      disabled="false"
      fillHeight="false"
      extraPadding="false"
      primaryBackground="false"
    ></toggle-header>
    <coerce-template-probe
      flagA="false"
      flagB=""
      flagC="true"
    ></coerce-template-probe>
  `,
})
class CoerceHostComponent {}

@Component({
  selector: 'coerce-template-probe',
  standalone: false,
  template: '<span>{{ flagA }}|{{ flagB }}|{{ flagC }}</span>',
})
class CoerceTemplateProbeComponent {
  @Input()
  @coerceBoolean()
  flagA = true;

  @Input()
  @coerceBoolean()
  flagB = false;

  @Input()
  @coerceBoolean()
  flagC = false;
}

describe('W2 @coerceBoolean() Decorator & useDefineForClassFields: false', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ClipboardModule,
        ToggleSelectModule,
        TranslateModule.forRoot(),
      ],
      declarations: [CoerceHostComponent, CoerceTemplateProbeComponent],
      providers: [
        {
          provide: ClipboardService,
          useValue: { copyFromContent: () => true },
        },
      ],
    }).compileComponents();
  });

  it('coerces string "false", "", "true", booleans, null, and undefined without own-property shadowing', () => {
    const demo = new CustomCoerceDemo();

    expect(Object.prototype.hasOwnProperty.call(demo, 'flagDefaultFalse')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(demo, 'flagDefaultTrue')).toBe(false);
    expect(demo.flagDefaultFalse).toBe(false);
    expect(demo.flagDefaultTrue).toBe(true);
    expect(demo.flagNoInit).toBeUndefined();

    Reflect.set(demo, 'flagDefaultTrue', 'false');
    expect(demo.flagDefaultTrue).toBe(false);

    Reflect.set(demo, 'flagDefaultFalse', '');
    expect(demo.flagDefaultFalse).toBe(true);

    Reflect.set(demo, 'flagDefaultFalse', 'false');
    expect(demo.flagDefaultFalse).toBe(false);

    Reflect.set(demo, 'flagDefaultFalse', 'true');
    expect(demo.flagDefaultFalse).toBe(true);

    Reflect.set(demo, 'flagDefaultFalse', null);
    expect(demo.flagDefaultFalse).toBe(false);

    Reflect.set(demo, 'flagDefaultFalse', undefined);
    expect(demo.flagDefaultFalse).toBe(false);
  });

  it('coerces string "false" to boolean false across all 14 @coerceBoolean() fields in CopyButton, ToggleSelect, and ToggleHeader', () => {
    const fixture = TestBed.createComponent(CoerceHostComponent);
    fixture.detectChanges();

    const copyDebug = fixture.debugElement.children[0];
    const copyComp = copyDebug.componentInstance as CopyButtonComponent;
    expect(copyComp.disabled).toBe(false);
    expect(copyComp.miniButton).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(copyComp, 'disabled')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(copyComp, 'miniButton')).toBe(false);

    const selectDebug = fixture.debugElement.children[1];
    const selectComp = selectDebug.componentInstance as ToggleSelectComponent;
    expect(selectComp.disabled).toBe(false);
    expect(selectComp.disablePagination).toBe(false);
    expect(selectComp.fillHeight).toBe(false);
    expect(selectComp.extraPadding).toBe(false);
    expect(selectComp.primaryBackground).toBe(false);
    for (const prop of ['disabled', 'disablePagination', 'fillHeight', 'extraPadding', 'primaryBackground']) {
      expect(Object.prototype.hasOwnProperty.call(selectComp, prop)).toBe(false);
    }

    const headerDebug = fixture.debugElement.children[2];
    const headerComp = headerDebug.componentInstance as ToggleHeaderComponent;
    expect(headerComp.disablePagination).toBe(false);
    expect(headerComp.selectMediaBreakpoint).toBe('');
    expect(headerComp.ignoreMdLgSize).toBe(false);
    expect(headerComp.disabled).toBe(false);
    expect(headerComp.fillHeight).toBe(false);
    expect(headerComp.extraPadding).toBe(false);
    expect(headerComp.primaryBackground).toBe(false);
    for (const prop of [
      'disablePagination',
      'ignoreMdLgSize',
      'disabled',
      'fillHeight',
      'extraPadding',
      'primaryBackground',
    ]) {
      expect(Object.prototype.hasOwnProperty.call(headerComp, prop)).toBe(false);
    }

    const probeDebug = fixture.debugElement.children[3];
    const probeComp = probeDebug.componentInstance as CoerceTemplateProbeComponent;
    expect(probeComp.flagA).toBe(false);
    expect(probeComp.flagB).toBe(true);
    expect(probeComp.flagC).toBe(true);
    expect((probeDebug.nativeElement as HTMLElement).textContent).toBe('false|true|true');

    // Direct runtime string assignment on ToggleHeader setter useSelectOnMdLg
    const zone = TestBed.inject(NgZone);
    const platform = TestBed.inject(Platform);
    const bp = TestBed.inject(BreakpointObserver);
    const cd = fixture.componentRef.injector.get(ChangeDetectorRef);
    const directHeader = new ToggleHeaderComponent(cd, platform, bp, zone);
    expect(directHeader.selectMediaBreakpoint).toBe('md-lg');
    Reflect.set(directHeader, 'useSelectOnMdLg', 'false');
    expect(directHeader.selectMediaBreakpoint).toBe('');
    Reflect.set(directHeader, 'useSelectOnMdLg', 'true');
    expect(directHeader.selectMediaBreakpoint).toBe('md-lg');

    fixture.destroy();
  });
});
