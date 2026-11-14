/**
 * @fileoverview Golden single-file example `docs-ai/examples/zoneless-Form.example.ts` demonstrating zero-`any` Zoneless Schema Form.
 * @zh 黄金单文件示例 `docs-ai/examples/zoneless-Form.example.ts`，演示基于 `@dotos/dui/standalone` 与 `@dotos/dui/schema` 的零 `any` 纯 Zoneless 企业表单。
 */

import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  DuiFormPrimitiveValue,
  DuiFormSchema,
  validateDuiFormSchema,
} from '@dotos/dui/schema';
import {
  DuiCardComponent,
  DuiSchemaFormComponent,
  provideDuiZoneless,
} from '@dotos/dui/standalone';

const DEVICE_FORM_SCHEMA: DuiFormSchema = {
  id: 'edge-gateway-config',
  title: '边缘网关接入配置',
  description: '零 any 声明式双栏高密度工业表单示例',
  columns: 2,
  density: 'compact',
  submitLabel: '保存配置',
  resetLabel: '重置',
  fields: [
    {
      key: 'gatewayName',
      label: '网关名称',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 32,
      placeholder: '例如 GW-SH-01',
    },
    {
      key: 'protocol',
      label: '采集协议',
      type: 'select',
      required: true,
      defaultValue: 'opcua',
      options: [
        { label: 'OPC UA', value: 'opcua' },
        { label: 'Modbus TCP', value: 'modbus' },
        { label: 'MQTT v5', value: 'mqtt' },
      ],
    },
    {
      key: 'pollIntervalMs',
      label: '轮询周期 (ms)',
      type: 'number',
      required: true,
      defaultValue: 500,
      min: 50,
      max: 60000,
      step: 50,
    },
    {
      key: 'tlsEnabled',
      label: '启用双向 TLS 加密',
      type: 'switch',
      defaultValue: true,
    },
  ],
};

/**
 * Golden example component `ZonelessFormExampleComponent` rendering validated `DuiSchemaFormComponent`.
 * @zh 黄金示例组件 `ZonelessFormExampleComponent`，演示 `validateDuiFormSchema` 预检与 `<dui-standalone-form>` 双向绑定。
 */
@Component({
  selector: 'dui-example-zoneless-form',
  standalone: true,
  imports: [DuiCardComponent, DuiSchemaFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dui-standalone-card [title]="'设备参数面板'" [elevated]="true" [padding]="'normal'">
      <dui-standalone-form
        [schema]="validatedSchema()"
        [(value)]="formValue"
        (submitted)="handleSaved($event)">
      </dui-standalone-form>
      @if (lastSavedSummary()) {
        <p class="saved-banner">{{ lastSavedSummary() }}</p>
      }
    </dui-standalone-card>
  `,
  styles: [
    `
      .saved-banner {
        margin: 12px 0 0;
        font-size: 12px;
        color: var(--dui-primary, var(--mat-sys-primary, #006a6a));
      }
    `,
  ],
})
export class ZonelessFormExampleComponent {
  readonly formValue: WritableSignal<Record<string, DuiFormPrimitiveValue>> =
    signal<Record<string, DuiFormPrimitiveValue>>({
      gatewayName: 'GW-PLANT-01',
      protocol: 'opcua',
      pollIntervalMs: 500,
      tlsEnabled: true,
    });

  readonly lastSavedSummary: WritableSignal<string> = signal<string>('');

  readonly validatedSchema: Signal<DuiFormSchema> = computed<DuiFormSchema>(() => {
    const check = validateDuiFormSchema(DEVICE_FORM_SCHEMA);
    return check.schema ?? DEVICE_FORM_SCHEMA;
  });

  /**
   * Handles validated form submission payload.
   * @zh 处理表单校验通过后的提交结果。
   * @param payload - Validated form values (`Record<string, DuiFormPrimitiveValue>`) / 校验后的表单键值对象
   */
  handleSaved(payload: Record<string, DuiFormPrimitiveValue>): void {
    this.lastSavedSummary.set(`已保存网关: ${String(payload['gatewayName'] ?? '')}`);
  }
}

/**
 * Bootstraps `ZonelessFormExampleComponent` in pure Zoneless mode without `Zone.js`.
 * @zh 以纯 Zoneless 模式独立启动 `ZonelessFormExampleComponent`。
 * @returns Promise resolving when bootstrap finishes (`Promise<unknown>`) / 启动 Promise
 */
export function bootstrapZonelessFormExample(): Promise<unknown> {
  return bootstrapApplication(ZonelessFormExampleComponent, {
    providers: [provideDuiZoneless()],
  });
}
