/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/module-example-page/module-live-presets.ts` providing default editable live-sandbox code for every playground mode.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/module-example-page/module-live-presets.ts`，为每种工作台模式提供真实使用 `@dotos1/dui` 组件、可直接在线编辑的默认模板与状态数据。
 */

import { JsonObject } from '../../components/live-template-stage/live-sandbox.types';
import { ModuleScenarioPreset, PlaygroundMode } from './module-example-presets';

/**
 * Interface `LiveSandboxDefaults` holding default template and state for a mode.
 * @zh 接口 `LiveSandboxDefaults`，某模式下的默认模板与状态 JSON。
 */
export interface LiveSandboxDefaults {
  /**
   * Default Angular template.
   * @zh 默认 Angular 模板。
   */
  liveTemplate: string;
  /**
   * Default state JSON text (pretty printed).
   * @zh 默认状态 JSON 文本（已格式化）。
   */
  liveState: string;
}

/**
 * Shared card wrapper style used by default templates.
 * @zh 默认模板共用的卡片外层样式。
 */
const CARD =
  'background:#fff;color:#0f172a;border-radius:14px;padding:18px 20px;box-shadow:0 10px 30px rgba(15,23,42,.18);display:flex;flex-direction:column;gap:12px;min-width:320px;max-width:560px;margin:auto;font-family:inherit';

/**
 * Default templates keyed by playground mode.
 * @zh 各模式默认模板（模板内可直接访问 `state` 与 `log(label, payload?)`）。
 */
const LIVE_TEMPLATES: Record<PlaygroundMode, string> = {
  color: `<div style="${CARD}">
  <div style="display:flex;align-items:center;gap:16px">
    <div style="width:88px;height:88px;border-radius:50%;box-shadow:0 12px 30px rgba(0,0,0,.25)"
         [style.background]="state.color" [style.opacity]="state.value / 100"></div>
    <div>
      <h3 style="margin:0">{{ state.title }}</h3>
      <small>色彩空间：{{ state.option }} · Alpha {{ state.value }}%</small>
    </div>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    @for (hex of state.palette; track hex) {
      <button type="button" style="width:30px;height:30px;border:0;border-radius:8px;cursor:pointer"
              [style.background]="hex" [style.outline]="hex === state.color ? '3px solid #0f172a' : 'none'"
              (click)="state.color = hex; log('ColorChange', { hex: hex })"></button>
    }
  </div>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', text: '应用主色 ' + state.color }"
              (click)="log('应用主色', state.color)"></dui-button>
</div>`,

  animation: `<div style="${CARD};align-items:center">
  <div style="width:140px;height:140px;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,#2563eb,#7c3aed);transition-property:transform,box-shadow"
       [style.transition-duration.ms]="state.value"
       [style.transform]="state.enabled ? 'rotate(8deg) scale(1.08)' : 'none'">
    <mat-icon>motion_photos_on</mat-icon>
    <strong>{{ state.option }}</strong>
  </div>
  <div>{{ state.title }} · 时长 {{ state.value }}ms</div>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', icon: 'play_arrow', text: '切换动画' }"
              (click)="state.enabled = !state.enabled; log('animation.toggle', { enabled: state.enabled })"></dui-button>
</div>`,

  carousel: `<div style="${CARD};padding:0;overflow:hidden">
  @if (state.slides[state.index]; as slide) {
    <div style="padding:28px;color:#fff;min-height:150px" [style.background]="slide.gradient">
      <small>第 {{ state.index + 1 }} / {{ state.slides.length }} 帧 · 间隔 {{ state.value }}ms</small>
      <h3 style="margin:8px 0">{{ slide.title }}</h3>
      <p style="margin:0;opacity:.85">{{ state.title }}</p>
    </div>
  }
  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px">
    <dui-button [config]="{ type: 'mat-icon-button', icon: 'chevron_left', text: '上一帧' }"
                (click)="state.index = (state.index - 1 + state.slides.length) % state.slides.length; log('carousel.prev', state.index)"></dui-button>
    <span>{{ state.option }}</span>
    <dui-button [config]="{ type: 'mat-icon-button', icon: 'chevron_right', text: '下一帧' }"
                (click)="state.index = (state.index + 1) % state.slides.length; log('carousel.next', state.index)"></dui-button>
  </div>
</div>`,

  overlay: `<div style="${CARD}">
  <div style="display:flex;align-items:center;gap:14px">
    <mat-icon [matBadge]="state.value > 99 ? '99+' : state.value" matBadgeColor="warn">notifications_active</mat-icon>
    <div style="flex:1">
      <strong>{{ state.title }}</strong>
      <div style="font-size:12px;color:#64748b">方位 / 模式：{{ state.option }}</div>
    </div>
    <mat-slide-toggle [(ngModel)]="state.enabled" (change)="log('overlay.toggle', { open: state.enabled })">展开</mat-slide-toggle>
  </div>
  @if (state.enabled) {
    <div style="background:#0f172a;color:#e2e8f0;border-radius:10px;padding:12px">
      浮层已展开（对齐策略：{{ state.option }}）
    </div>
  }
  <dui-button [config]="{ type: 'mat-button', color: 'primary', icon: 'done_all', text: '全部已读' }"
              (click)="state.value = 0; log('notifications.clear')"></dui-button>
</div>`,

  'dnd-layout': `<div style="${CARD}">
  <div>{{ state.title }} · 共 {{ state.items.length }} 项，点击卡片切换选中</div>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
    @for (item of state.items; track item.id) {
      <div style="border-radius:10px;padding:10px;cursor:pointer;border:2px solid"
           [style.border-color]="item.selected ? '#2563eb' : '#e2e8f0'"
           [style.min-height.px]="state.value"
           (click)="item.selected = !item.selected; log('dragselect.toggle', item)">
        <strong>{{ item.id }}</strong>
        <div style="font-size:12px;color:#64748b">{{ item.name }}</div>
      </div>
    }
  </div>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', text: '策略：' + state.option }"
              (click)="log('dnd.strategy', state.option)"></dui-button>
</div>`,

  'icon-svg': `<div style="${CARD};align-items:center">
  <mat-icon [style.font-size.px]="state.value" [style.width.px]="state.value" [style.height.px]="state.value"
            [style.color]="state.enabled ? '#0284c7' : '#475569'">{{ state.icon }}</mat-icon>
  <svg viewBox="0 0 280 80" width="280" height="80">
    <path d="M 10 60 Q 70 0, 140 40 T 270 20" fill="none" stroke="#6366f1" stroke-width="4"
          stroke-linecap="round" [attr.stroke-dasharray]="state.enabled ? '10 6' : null"></path>
  </svg>
  <div>{{ state.title }} ({{ state.value }}px · {{ state.option }})</div>
  <dui-button [config]="{ type: 'mat-icon-button', icon: state.icon, text: '复制图标名' }"
              (click)="log('icon.copy', state.icon)"></dui-button>
</div>`,

  'input-utility': `<div style="${CARD}">
  <mat-form-field appearance="outline" style="width:100%">
    <mat-label>{{ state.option }}</mat-label>
    <input matInput [type]="state.enabled ? 'text' : 'password'" [(ngModel)]="state.title"
           (ngModelChange)="log('input.change', $event)" />
  </mat-form-field>
  <div style="font-size:12px;color:#64748b">长度 {{ state.title.length }} / 阈值 {{ state.value }}</div>
  <mat-progress-bar mode="determinate" [value]="(state.title.length / state.value) * 100"></mat-progress-bar>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', icon: 'content_copy', text: '复制 / 执行' }"
              (click)="log('clipboard.copy', state.title)"></dui-button>
</div>`,

  'core-service': `<div style="${CARD}">
  <strong>{{ state.title }}</strong>
  <table style="width:100%;border-collapse:collapse;font-size:12px">
    @for (row of state.entries; track row.key) {
      <tr style="border-bottom:1px solid #e2e8f0">
        <td style="padding:6px"><code>{{ row.key }}</code></td>
        <td style="padding:6px">{{ row.value }}</td>
        <td style="padding:6px;color:#64748b">TTL {{ state.value }}s</td>
      </tr>
    }
  </table>
  <dui-highlight [content]="state.entries | json" [codeLang]="'json'"></dui-highlight>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', text: '执行 ' + state.option }"
              (click)="log('core.' + state.option, state.entries.length)"></dui-button>
</div>`,

  'form-control': `<div style="${CARD}">
  <strong>{{ state.title }}</strong>
  <div style="display:flex;gap:6px;flex-wrap:wrap">
    @for (opt of state.options; track opt) {
      <button mat-stroked-button type="button" [color]="opt === state.option ? 'primary' : undefined"
              (click)="state.option = opt; log('option', opt)">{{ opt }}</button>
    }
  </div>
  <mat-slider min="0" [max]="state.max" style="width:100%">
    <input matSliderThumb [(ngModel)]="state.value" (valueChange)="log('slider', $event)" />
  </mat-slider>
  <mat-checkbox [(ngModel)]="state.enabled">启用（{{ state.enabled }}）· 当前值 {{ state.value }}</mat-checkbox>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', text: '提交表单' }"
              (click)="log('form.submit', { option: state.option, value: state.value, enabled: state.enabled })"></dui-button>
</div>`,

  toolbar: `<div style="${CARD};padding:8px 12px;flex-direction:row;align-items:center;gap:8px" [style.gap.px]="state.value / 4">
  <mat-icon>construction</mat-icon>
  <strong>{{ state.title }}</strong>
  <span style="flex:1"></span>
  <dui-button [config]="{ type: 'mat-icon-button', icon: 'save', text: '保存' }" (click)="log('toolbar.save')"></dui-button>
  <dui-button [config]="{ type: 'mat-icon-button', icon: 'tune', text: '校准' }" (click)="log('toolbar.tune', state.option)"></dui-button>
  @if (state.enabled) {
    <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', text: '发布' }" (click)="log('toolbar.publish')"></dui-button>
  }
</div>`,

  'pipe-codec': `<div style="${CARD}">
  <div><code>title | uppercase</code> → <strong>{{ state.title | uppercase }}</strong></div>
  <div><code>value | number:'1.0-2'</code> → <strong>{{ state.value | number:'1.0-2' }}</strong></div>
  <div><code>value / 100 | percent</code> → <strong>{{ state.value / 100 | percent }}</strong></div>
  <div><code>title | slice:0:12</code> → <strong>{{ state.title | slice:0:12 }}</strong></div>
  <dui-highlight [content]="state | json" [codeLang]="'json'"></dui-highlight>
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', text: '转换 (' + state.option + ')' }"
              (click)="log('pipe.transform', state.option)"></dui-button>
</div>`,

  'ux-widget': `<div style="${CARD}">
  <div style="display:flex;align-items:center;gap:14px">
    <dui-avatar [value]="{ name: state.title }" [size]="state.value" [round]="state.enabled" bgColor="#2563eb"></dui-avatar>
    <div>
      <strong>{{ state.title }}</strong>
      <div style="font-size:12px;color:#64748b">模式：{{ state.option }} · 尺寸 {{ state.value }}px</div>
    </div>
  </div>
  @for (rule of state.rules; track $index) {
    <div style="font-size:12px"><code>{{ $index === 0 ? 'WHERE' : 'AND' }}</code> {{ rule.field }} {{ rule.operator }} '{{ rule.value }}'</div>
  }
  <dui-button [config]="{ type: 'mat-raised-button', color: 'primary', icon: 'add', text: '新增规则' }"
              (click)="state.rules.push({ field: 'depthM', operator: '>=', value: '' + state.value }); log('query.addRule', state.rules.length)"></dui-button>
</div>`,
};

/**
 * Builds mode-specific extra state fields.
 * @zh 构造各模式专属的附加状态字段。
 * @param mode - Playground mode / 工作台模式
 * @param preset - Scenario preset / 场景预设
 * @returns Extra state / 附加状态
 */
function extraState(mode: PlaygroundMode, preset: ModuleScenarioPreset): JsonObject {
  switch (mode) {
    case 'color':
      return {
        color: preset.primaryDefault.startsWith('#') ? preset.primaryDefault : '#1976D2',
        palette: ['#1976D2', '#00ACC1', '#00897B', '#43A047', '#FB8C00', '#E53935', '#8E24AA'],
      };
    case 'carousel':
      return {
        index: 0,
        slides: [
          { title: '三维地震体实时体渲染引擎', gradient: 'linear-gradient(135deg,#0f172a,#1d4ed8)' },
          { title: '智能钻完井随钻工程监控中心', gradient: 'linear-gradient(135deg,#064e3b,#10b981)' },
          { title: '油气藏数值模拟与生产优化平台', gradient: 'linear-gradient(135deg,#311042,#c026d3)' },
        ],
      };
    case 'dnd-layout':
      return {
        items: [
          { id: 'WELL-A01', name: '渤中 19-6 先导试验井', selected: true },
          { id: 'WELL-A02', name: '渤中 19-6 高压气井', selected: false },
          { id: 'WELL-B08', name: '旅大 21-2 水平开发井', selected: true },
          { id: 'WELL-C14', name: '曹妃甸 11-1 注采联动井', selected: false },
        ],
      };
    case 'icon-svg':
      return { icon: 'auto_awesome' };
    case 'core-service':
      return {
        entries: [
          { key: 'dui.theme.mode', value: 'darkblue' },
          { key: 'dui.auth.principal', value: 'chief.engineer@dotos.cn' },
        ],
      };
    case 'form-control':
      return { max: preset.numericMax };
    case 'ux-widget':
      return {
        rules: [
          { field: 'wellStatus', operator: '=', value: 'drilling' },
          { field: 'porosityPct', operator: '>', value: '12.5' },
        ],
      };
    default:
      return {};
  }
}

/**
 * Builds default live template/state for a resolved preset.
 * @zh 根据场景预设生成默认在线模板与状态 JSON；`title/value/option/enabled` 四个字段与右侧参数控件双向联动。
 * @param preset - Scenario preset / 场景预设
 * @returns Defaults / 默认代码
 */
export function buildLiveSandboxDefaults(preset: ModuleScenarioPreset): LiveSandboxDefaults {
  const state: JsonObject = {
    title: preset.primaryDefault,
    value: preset.numericDefault,
    option: preset.options[0] || 'default',
    enabled: true,
    options: [...preset.options],
    ...extraState(preset.mode, preset),
  };
  return {
    liveTemplate: LIVE_TEMPLATES[preset.mode] ?? LIVE_TEMPLATES['ux-widget'],
    liveState: JSON.stringify(state, null, 2),
  };
}
