/**
 * @fileoverview Unit tests for `@dotos/dui/micro-app` (`DuiMicroAppComponent` and `DuiMicroAppEventBus`).
 * @zh `@dotos/dui/micro-app`（`<dui-micro-app>` 多框架桥接容器与 `DuiMicroAppEventBus` 跨框架事件总线）单元测试。
 */

import { Component, Injectable, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeService } from '@dotos/dui/theme';
import {
  DUI_MICRO_APP_CUSTOM_EVENT,
  DUI_MICRO_APP_HOST_VERSION,
  DuiMicroAppComponent,
  DuiMicroAppContext,
  DuiMicroAppEventBus,
  DuiMicroAppLifecycleModule,
  DuiMicroAppRemoteDescriptor,
} from './public-api';

@Injectable({ providedIn: 'root' })
class SharedHostTenantService {
  public readonly tenantCode = 'dotos-enterprise';
}

@Component({
  selector: 'dui-test-federated-widget',
  standalone: true,
  template: `<div class="federated-widget" [attr.data-tenant]="tenant.tenantCode">{{ title() }}</div>`,
})
class MockFederatedAngularWidgetComponent {
  public readonly title = input<string>('default-widget');
  public context?: DuiMicroAppContext;
  constructor(public readonly tenant: SharedHostTenantService) {}
}

async function flushMicroAppLifecycle(): Promise<void> {
  TestBed.flushEffects();
  await new Promise<void>((resolve) => setTimeout(resolve, 10));
}

describe('DuiMicroAppComponent & DuiMicroAppEventBus (M3-3)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuiMicroAppComponent],
      providers: [
        {
          provide: ThemeService,
          useFactory: () =>
            new ThemeService({
              get: () => undefined,
              set: () => undefined,
            } as never),
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    const bus = TestBed.inject(DuiMicroAppEventBus);
    bus.clear();
  });

  it('mounts React-style ESM micro-app, injects M3 context/CSS tokens, reacts to prop/theme updates, and unmounts on destroy', async () => {
    const mountCalls: Array<{ el: HTMLElement; ctx: DuiMicroAppContext }> = [];
    const updateCalls: Array<{ el: HTMLElement; ctx: DuiMicroAppContext }> = [];
    const unmountCalls: HTMLElement[] = [];

    const reactLikeModule: DuiMicroAppLifecycleModule = {
      mount(el: HTMLElement, context: DuiMicroAppContext): void {
        mountCalls.push({ el, ctx: context });
        const root = document.createElement('section');
        root.className = 'react-19-island';
        root.textContent = `React:${String(context.props['viewTitle'] ?? '')}:${context.locale}`;
        el.appendChild(root);
      },
      update(el: HTMLElement, context: DuiMicroAppContext): void {
        updateCalls.push({ el, ctx: context });
        const root = el.querySelector('.react-19-island');
        if (root) {
          root.textContent = `React:${String(context.props['viewTitle'] ?? '')}:${context.locale}:${context.colorScheme}`;
        }
      },
      unmount(el: HTMLElement): void {
        unmountCalls.push(el);
        el.innerHTML = '';
      },
    };

    const descriptor: DuiMicroAppRemoteDescriptor = {
      protocol: 'esm-mount',
      name: 'react-analytics-island',
      loader: async () => reactLikeModule,
    };

    const themeService = TestBed.inject(ThemeService);
    themeService.changeTheme('teal-600', 'orange-800', 'red-800', 'light', 'compact', 'fill');

    const fixture: ComponentFixture<DuiMicroAppComponent> =
      TestBed.createComponent(DuiMicroAppComponent);
    let mountedCount = 0;
    fixture.componentInstance.mounted.subscribe(() => {
      mountedCount++;
    });

    fixture.componentRef.setInput('remote', descriptor);
    fixture.componentRef.setInput('props', { viewTitle: 'KanbanMetrics' });
    fixture.componentRef.setInput('authToken', 'Bearer jwt-token-01');
    fixture.componentRef.setInput('locale', 'zh_CN');
    fixture.detectChanges();

    await flushMicroAppLifecycle();

    expect(mountedCount).toBe(1);
    expect(mountCalls.length).toBe(1);

    const firstMount = mountCalls[0];
    expect(firstMount.ctx.hostVersion).toBe(DUI_MICRO_APP_HOST_VERSION);
    expect(firstMount.ctx.authToken).toBe('Bearer jwt-token-01');
    expect(firstMount.ctx.locale).toBe('zh_CN');
    expect(firstMount.ctx.colorScheme).toBe('light');
    expect(firstMount.ctx.props['viewTitle']).toBe('KanbanMetrics');
    expect(firstMount.ctx.themeTokens['--mat-sys-primary']).toBeTruthy();
    expect(firstMount.ctx.themeTokens['--dui-primary']).toBeTruthy();

    // Verify M3 CSS custom properties were written onto both host and inner mount stage
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.style.getPropertyValue('--mat-sys-primary')).toBe(
      firstMount.ctx.themeTokens['--mat-sys-primary'],
    );
    expect(firstMount.el.style.getPropertyValue('--dui-primary')).toBe(
      firstMount.ctx.themeTokens['--dui-primary'],
    );
    expect(hostEl.querySelector('.react-19-island')?.textContent).toBe(
      'React:KanbanMetrics:zh_CN',
    );

    // Update props + switch ThemeService to dark theme -> triggers update(el, context) & updates CSS tokens
    themeService.changeTheme('teal-600', 'orange-800', 'red-800', 'dark', 'compact', 'fill');
    fixture.componentRef.setInput('props', { viewTitle: 'DarkDashboard' });
    fixture.componentRef.setInput('locale', 'en_US');
    fixture.detectChanges();
    TestBed.flushEffects();

    expect(updateCalls.length).toBeGreaterThanOrEqual(1);
    const latestUpdate = updateCalls[updateCalls.length - 1];
    expect(latestUpdate.ctx.colorScheme).toBe('dark');
    expect(latestUpdate.ctx.locale).toBe('en_US');
    expect(latestUpdate.ctx.props['viewTitle']).toBe('DarkDashboard');
    expect(hostEl.querySelector('.react-19-island')?.textContent).toBe(
      'React:DarkDashboard:en_US:dark',
    );

    // Destroy component -> triggers unmount(el)
    fixture.destroy();
    await Promise.resolve();
    expect(unmountCalls.length).toBe(1);
  });

  it('penetrates M3 CSS tokens into Shadow DOM when useShadowDom is enabled', async () => {
    const descriptor: DuiMicroAppRemoteDescriptor = {
      protocol: 'esm-mount',
      loader: async () => ({
        mount(el: HTMLElement): void {
          const badge = document.createElement('span');
          badge.className = 'shadow-badge';
          badge.textContent = 'Isolated';
          el.appendChild(badge);
        },
      }),
    };

    const fixture = TestBed.createComponent(DuiMicroAppComponent);
    fixture.componentRef.setInput('remote', descriptor);
    fixture.componentRef.setInput('useShadowDom', true);
    fixture.detectChanges();

    await flushMicroAppLifecycle();

    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.shadowRoot).not.toBeNull();
    const shadowStage = hostEl.shadowRoot?.querySelector('div') as HTMLElement | null;
    expect(shadowStage).not.toBeNull();
    expect(shadowStage?.style.getPropertyValue('--mat-sys-surface')).toBeTruthy();
    expect(shadowStage?.querySelector('.shadow-badge')?.textContent).toBe('Isolated');
    fixture.destroy();
  });

  it('bridges bidirectional events via DuiMicroAppEventBus and browser CustomEvent("dui:micro-app-event")', async () => {
    const bus = TestBed.inject(DuiMicroAppEventBus);
    const receivedOnBus: Array<{ orderId: string }> = [];
    const receivedFromMicroOutput: Array<{ topic: string; payload: unknown }> = [];
    const windowEvents: Array<{ topic: string; payload: unknown }> = [];

    const unsubscribeTopic = bus.on<{ orderId: string }>('order:selected', (payload) => {
      receivedOnBus.push(payload);
    });

    const onWindowCustomEvent = (event: Event): void => {
      if (event instanceof CustomEvent && event.detail) {
        windowEvents.push({
          topic: String(event.detail.topic),
          payload: event.detail.payload,
        });
      }
    };
    window.addEventListener(DUI_MICRO_APP_CUSTOM_EVENT, onWindowCustomEvent);

    const fixture = TestBed.createComponent(DuiMicroAppComponent);
    fixture.componentInstance.microEvent.subscribe((evt) => {
      receivedFromMicroOutput.push(evt);
    });
    fixture.componentRef.setInput('remote', {
      protocol: 'esm-mount',
      loader: async () => ({
        mount(_el: HTMLElement, ctx: DuiMicroAppContext): void {
          ctx.eventBus.emit('order:selected', { orderId: 'ORD-1001' });
        },
      }),
    });
    fixture.detectChanges();

    await flushMicroAppLifecycle();

    // 1) Micro-app emitted via context.eventBus -> received by Angular subscriber, @Output() microEvent, and window CustomEvent
    expect(receivedOnBus).toEqual([{ orderId: 'ORD-1001' }]);
    expect(receivedFromMicroOutput).toEqual([
      { topic: 'order:selected', payload: { orderId: 'ORD-1001' } },
    ]);
    expect(windowEvents).toEqual([
      { topic: 'order:selected', payload: { orderId: 'ORD-1001' } },
    ]);

    // 2) External React/Vue bundle dispatches CustomEvent('dui:micro-app-event') on window -> bridged into Angular bus & output
    window.dispatchEvent(
      new CustomEvent(DUI_MICRO_APP_CUSTOM_EVENT, {
        detail: {
          topic: 'order:selected',
          payload: { orderId: 'ORD-2002-EXTERNAL' },
          sourceId: 'external-vue-bundle',
        },
      }),
    );

    expect(receivedOnBus.length).toBe(2);
    expect(receivedOnBus[1]).toEqual({ orderId: 'ORD-2002-EXTERNAL' });
    expect(receivedFromMicroOutput.length).toBe(2);

    // 3) Unsubscribe disposer stops further notifications
    unsubscribeTopic();
    bus.emit('order:selected', { orderId: 'ORD-3003' });
    expect(receivedOnBus.length).toBe(2);

    window.removeEventListener(DUI_MICRO_APP_CUSTOM_EVENT, onWindowCustomEvent);
    fixture.destroy();
  });

  it('mounts Angular Standalone component via native-federation and shares host EnvironmentInjector singletons', async () => {
    const descriptor: DuiMicroAppRemoteDescriptor = {
      protocol: 'native-federation',
      loader: async () => ({
        MockFederatedAngularWidgetComponent,
      }),
      exportName: 'MockFederatedAngularWidgetComponent',
    };

    const propsSig = signal<Record<string, unknown>>({ title: 'FederatedKanban' });
    const fixture = TestBed.createComponent(DuiMicroAppComponent);
    fixture.componentRef.setInput('remote', descriptor);
    fixture.componentRef.setInput('props', propsSig());
    fixture.detectChanges();

    await flushMicroAppLifecycle();

    const widgetEl = fixture.nativeElement.querySelector('.federated-widget') as HTMLElement | null;
    expect(widgetEl).not.toBeNull();
    expect(widgetEl?.getAttribute('data-tenant')).toBe('dotos-enterprise');
    expect(widgetEl?.textContent).toBe('FederatedKanban');

    fixture.destroy();
  });

  it('emits loadError when remote loader rejects', async () => {
    const errors: unknown[] = [];
    const fixture = TestBed.createComponent(DuiMicroAppComponent);
    fixture.componentInstance.loadError.subscribe((err) => errors.push(err));
    fixture.componentRef.setInput('remote', {
      protocol: 'esm-mount',
      loader: async () => {
        throw new Error('Remote bundle 404');
      },
    });
    fixture.detectChanges();

    await flushMicroAppLifecycle();

    expect(errors.length).toBe(1);
    expect((errors[0] as Error).message).toContain('Remote bundle 404');
    fixture.destroy();
  });
});
