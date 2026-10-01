import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

export type zDepth = 0 | 1 | 2 | 3 | 4 | 5;

@Component({
  selector: 'color-raised',
  template: `
  <div class="raised-wrap">
    <div class="raised-bg zDepth-{{zDepth}}" [style.background]="background"></div>
    <div class="raised-content">
      <ng-content></ng-content>
    </div>
  </div>
  `,
  styles: [`
    .raised-wrap {
      position: relative;
      display: inline-block;
    }
    .raised-bg {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }
    .raised-content {
      position: relative;
    }
    .zDepth-0 {
      box-shadow: none;
    }
    .zDepth-1 {
      box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
    }
    .zDepth-2 {
      box-shadow: 0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2);
    }
    .zDepth-3 {
      box-shadow: 0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24);
    }
    .zDepth-4 {
      box-shadow: 0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22);
    }
    .zDepth-5 {
      box-shadow: 0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2);
    }
  `],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
/**
 * Wraps projected content in a card-like container with a Material "elevation" (zDepth) shadow.
 * @zh 将投影内容包裹在带有 Material "层级"（zDepth）阴影的卡片式容器中。
 */
export class RaisedComponent {
  /** @zh 阴影层级（0-5），层级越高阴影越明显。 */
  @Input() zDepth: zDepth = 1;
  /** @zh 圆角半径。 */
  @Input() radius = 1;
  /** @zh 背景颜色。 */
  @Input() background = '#fff';
}

@NgModule({
  declarations: [RaisedComponent],
  exports: [RaisedComponent],
  imports: [CommonModule],
})
export class RaisedModule { }
