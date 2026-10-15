import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateService } from '@dotos/dui/translator';
import { IconModule } from './icon.module';
import { FontLoaderService } from './font-loader.service';

@Component({
  template: `
    <dui-icon id="a" value="home" style="color: red; margin: 2px"></dui-icon>
    <dui-icon id="b" value="home" [iconStyle]="{ color: 'blue' }"></dui-icon>
  `,
})
class HostComponent {}

/**
 * b8c5e5c 复核:<dui-icon> 不能有名叫 style 的 @Input。否则宿主上的静态
 * style="..." 会被当成输入值(字符串)送进去,模板里的 [ngStyle] 抛 NG0901。
 */
describe('IconComponent(b8c5e5c 复核)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconModule],
      declarations: [HostComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: 'apiBase', useValue: '/api' },
        { provide: TranslateService, useValue: {} },
        { provide: FontLoaderService, useValue: {} },
      ],
    });
  });

  it('宿主带静态 style 时渲染不报错,iconStyle 照常生效', () => {
    const fixture = TestBed.createComponent(HostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    const b: HTMLElement = fixture.nativeElement.querySelector('#b mat-icon');
    expect(b.style.color).toBe('blue');
    const a: HTMLElement = fixture.nativeElement.querySelector('#a');
    expect(a.style.color).toBe('red');
  });
});
