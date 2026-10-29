/**
 * @fileoverview Module `src/ux/avatar/avatar.component.ts` providing avatar component definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar.component.ts`，提供头像组件相关的定义与实现。
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Avatar } from './avatar';
import { AvatarService } from './avatar.service';
import { IAVatar } from './avatar.interface';
import { SafeUrl } from '@angular/platform-browser';

/**
 * Type alias `Style` representing style (`Partial<CSSStyleDeclaration>`).
 * @zh 类型别名 `Style`，表示样式（`Partial<CSSStyleDeclaration>`）。
 */
type Style = Partial<CSSStyleDeclaration>;

/**
 * Angular component `AvatarComponent` (selector: 'dui-avatar') providing avatar component presentation and interaction in `src/ux/avatar`.
 * @zh Angular 组件 `AvatarComponent`（selector: 'dui-avatar'），提供头像组件的视图渲染与交互逻辑（位于 `src/ux/avatar`）。
 */
@Component({
  selector: 'dui-avatar',

  templateUrl: './avatar.component.html',
  changeDetection:ChangeDetectionStrategy.Default,
  
})
export class AvatarComponent implements OnChanges, OnDestroy {

  /**
   * Template/content query reference `imgElement` (`ElementRef<any>`) targeting img element.
   * @zh 模板/内容视图查询引用 `imgElement`（`@ViewChild`），指向图片元素。
   */
  @ViewChild('imageAvatar',{static:false}) imgElement: ElementRef;

  /**
   * Input property `round` (`boolean`) configuring round (default: `true`).
   * @zh 输入属性 `round`（类型：`boolean`），用于配置四舍五入（默认值：`true`）。
   */
  @Input()
  public round = true;
  /**
   * Input property `size` (`string | number`) configuring size (default: `50`).
   * @zh 输入属性 `size`（类型：`string | number`），用于配置尺寸（默认值：`50`）。
   */
  @Input()
  public size: string | number = 50;
  /**
   * Input property `textSizeRatio` (`number`) configuring text size ratio (default: `3`).
   * @zh 输入属性 `textSizeRatio`（类型：`number`），用于配置文本尺寸比例（默认值：`3`）。
   */
  @Input()
  public textSizeRatio = 3;
  /**
   * Input property `bgColor` (`string`) configuring bg color.
   * @zh 输入属性 `bgColor`（类型：`string`），用于配置背景颜色。
   */
  @Input()
  public bgColor: string | undefined;
  /**
   * Input property `fgColor` (`string`) configuring fg color (default: `'#FFF'`).
   * @zh 输入属性 `fgColor`（类型：`string`），用于配置前景颜色（默认值：`'#FFF'`）。
   */
  @Input()
  public fgColor = '#FFF';
  /**
   * Input property `borderColor` (`string`) configuring border color.
   * @zh 输入属性 `borderColor`（类型：`string`），用于配置边框颜色。
   */
  @Input()
  public borderColor: string | undefined;
  /**
   * Input property `style` (`Partial<CSSStyleDeclaration>`) configuring style (default: `{}`).
   * @zh 输入属性 `style`（类型：`Partial<CSSStyleDeclaration>`），用于配置样式（默认值：`{}`）。
   */
  @Input()
  public style: Style = {};
  /**
   * Input property `cornerRadius` (`string | number`) configuring corner radius (default: `0`).
   * @zh 输入属性 `cornerRadius`（类型：`string | number`），用于配置corner半径（默认值：`0`）。
   */
  @Input()
  public cornerRadius: string | number = 0;

  /**
   * Input setter `value` updating value.
   * @zh 输入属性 `value` 的设置器，用于更新值。
   * @param v - New value value (`IAVatar`) / 新的值值（`IAVatar`）
   */
  @Input()
  public set value(v){
    if(v){
        if(v.avatar){
          v.src=v.avatar;
        }
        this._value=new Avatar(v.id,v.name,v.src);
        this.changeDetectionRef.detectChanges();
    }
  }

  /**
   * Gets the current value (`value: any`).
   * @zh 获取当前值（`value: any`）。
   */
  public get value(){
    return this._value;
  }

  /**
   * Property `_value` (`IAVatar`) storing value.
   * @zh 属性 `_value`（类型：`IAVatar`），用于存储或配置值。
   */
  private _value:IAVatar;

  /**
   * Input property `initialsSize` (`string | number`) configuring initials size (default: `0`).
   * @zh 输入属性 `initialsSize`（类型：`string | number`），用于配置初始尺寸（默认值：`0`）。
   */
  @Input()
  public initialsSize: string | number = 0;

  /**
   * Output event emitter `clickOnAvatar` (`EventEmitter<IAVatar>`) firing when click on avatar occurs.
   * @zh 输出事件 `clickOnAvatar`（类型：`EventEmitter<IAVatar>`），当触发点击当头像时向外发出事件。
   */
  @Output()
  public clickOnAvatar: EventEmitter<IAVatar> = new EventEmitter<IAVatar>();

  /**
   * Property `isAlive` (`boolean`) storing is alive (default: `true`).
   * @zh 属性 `isAlive`（类型：`boolean`），用于存储或配置是否为Alive（默认值：`true`）。
   */
  public isAlive = true;
  /**
   * Property `avatarSrc` (`string | SafeUrl`) storing avatar src (default: `null`).
   * @zh 属性 `avatarSrc`（类型：`string | SafeUrl`），用于存储或配置头像源路径（默认值：`null`）。
   */
  public avatarSrc: string | SafeUrl = null;
  /**
   * Property `avatarText` (`string`) storing avatar text (default: `null`).
   * @zh 属性 `avatarText`（类型：`string`），用于存储或配置头像文本（默认值：`null`）。
   */
  public avatarText: string | null = null;
  /**
   * Property `avatarStyle` (`Partial<CSSStyleDeclaration>`) storing avatar style (default: `{}`).
   * @zh 属性 `avatarStyle`（类型：`Partial<CSSStyleDeclaration>`），用于存储或配置头像样式（默认值：`{}`）。
   */
  public avatarStyle: Style = {};
  /**
   * Property `hostStyle` (`Partial<CSSStyleDeclaration>`) storing host style (default: `{}`).
   * @zh 属性 `hostStyle`（类型：`Partial<CSSStyleDeclaration>`），用于存储或配置宿主样式（默认值：`{}`）。
   */
  public hostStyle: Style = {};
  /**
   * Property `isImageAvatar` (`boolean`) storing is image avatar (default: `false`).
   * @zh 属性 `isImageAvatar`（类型：`boolean`），用于存储或配置是否为图像头像（默认值：`false`）。
   */
  public isImageAvatar=false;

  /**
   * Creates an instance of `AvatarComponent` and initializes its dependencies and internal state.
   * @zh 创建 `AvatarComponent` 实例，并初始化其依赖项与内部状态。
   * @param changeDetectionRef - Injected or initial change detection ref (`ChangeDetectorRef`) / 注入或传入的变更变更检测引用（`ChangeDetectorRef`）
   * @param avatarService - Injected or initial avatar service (`AvatarService`) / 注入或传入的头像服务（`AvatarService`）
   */
  constructor(
    protected changeDetectionRef: ChangeDetectorRef,
    private avatarService: AvatarService
  ) {}

  /**
   * Executes `onAvatarClicked` to handle on avatar clicked.
   * @zh 执行 `onAvatarClicked`，用于当头像点击。
   */
  public onAvatarClicked(): void {
    this.clickOnAvatar.emit(this.value);
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.fetchAvatarSource();
      this.initializeAvatar();
    }
  }

  /**
   * Executes `fetchAvatarSource` to handle fetch avatar source.
   * @zh 执行 `fetchAvatarSource`，用于获取头像源。
   */
  public fetchAvatarSource(): void {
    if(this.value){
      if (this.avatarService.isTextAvatar(this.value)) {
        this.buildTextAvatar(this.value);
        this.avatarSrc = null;
        this.isImageAvatar=false;
      } else {
        this.isImageAvatar=true;
        this.changeDetectionRef.detectChanges();
        this.buildImageAvatar(this.value);
      }
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  /**
   * Executes `initializeAvatar` to handle initialize avatar.
   * @zh 执行 `initializeAvatar`，用于初始化头像。
   */
  private initializeAvatar(): void {
    this.hostStyle = {
      width: this.size + 'px',
      height: this.size + 'px'
    };
  }

  /**
   * Executes `buildTextAvatar` to handle build text avatar.
   * @zh 执行 `buildTextAvatar`，用于构建文本头像。
   * @param avatarSource - avatar source parameter (`IAVatar`) / 头像源参数（`IAVatar`）
   */
  private buildTextAvatar(avatarSource: IAVatar): void {
    this.avatarText = avatarSource.getAvatar(+this.initialsSize);
    this.avatarStyle = this.getInitialsStyle(avatarSource.name);
  }

  /**
   * Executes `buildImageAvatar` to handle build image avatar.
   * @zh 执行 `buildImageAvatar`，用于构建图像头像。
   * @param avatarSource - avatar source parameter (`IAVatar`) / 头像源参数（`IAVatar`）
   */
  private buildImageAvatar(avatarSource: IAVatar): void {
    this.avatarStyle = this.getImageStyle();

    if(avatarSource.src.toString().startsWith('data:')){
      let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
      let baseRawString=avatarSource.src.toString();
      let base64=baseRawString.substring(baseRawString.indexOf(",")+1,baseRawString.length);
      this.avatarSrc = '';

       if(this.imgElement&&base64regex.test(base64)){
         this.imgElement.nativeElement.src =avatarSource.src;
       }
    }else{
      this.avatarSrc = avatarSource.src;
    }
  }

  /**
   * Executes `getInitialsStyle` to handle get initials style.
   * @zh 执行 `getInitialsStyle`，用于获取初始样式。
   * @param avatarValue - avatar value parameter (`string`) / 头像值参数（`string`）
   * @returns Result of type `Partial<CSSStyleDeclaration>` / 类型为 `Partial<CSSStyleDeclaration>` 的返回值
   */
  private getInitialsStyle(avatarValue: string): Style {
    return {
      maxWidth: '100%',
      borderRadius: this.round ? '50%' : this.cornerRadius + 'px',
      border: this.borderColor ? '1px solid ' + this.borderColor : '',
      width: this.size + 'px',
      height: this.size + 'px',
      textAlign: 'center',
      textTransform: 'uppercase',
      color: this.fgColor,
      backgroundColor: this.bgColor
        ? this.bgColor
        : this.avatarService.getRandomColor(avatarValue),
      font:
        Math.floor(+this.size / this.textSizeRatio) +
        'px Helvetica, Arial, sans-serif',
      lineHeight: this.size + 'px',
      ...this.style
    };
  }

  /**
   * Executes `getImageStyle` to handle get image style.
   * @zh 执行 `getImageStyle`，用于获取图像样式。
   * @returns Result of type `Partial<CSSStyleDeclaration>` / 类型为 `Partial<CSSStyleDeclaration>` 的返回值
   */
  private getImageStyle(): Style {
    return {
      maxWidth: '100%',
      borderRadius: this.round ? '50%' : this.cornerRadius + 'px',
      border: this.borderColor ? '1px solid ' + this.borderColor : '',
      width: this.size + 'px',
      height: this.size + 'px',
      ...this.style,
    };
  }
}
