/**
 * @fileoverview Module `src/ux/windows/resizer/classes/resizer.factory.ts` providing resizer factory definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/resizer.factory.ts`，提供尺寸调整器工厂相关的定义与实现。
 */

import { Injectable, Injector } from '@angular/core';
import { ResizableDirective } from '../directives';
import { ResizerEnum } from '../enums';
import { ɵBaseResizer } from './base-resizer';
import { ɵBottomLeftResizer } from './bottom-left-resizer';
import { ɵBottomResizer } from './bottom-resizer';
import { ɵBottomRightResizer } from './bottom-right-resizer';
import { ɵLeftResizer } from './left-resizer';
import { ɵRightResizer } from './right-resizer';
import { ɵTopLeftResizer } from './top-left-resizer';
import { ɵTopResizer } from './top-resizer';
import { ɵTopRightResizer } from './top-right-resizer';

/**
 * Injectable Angular service `ɵResizerFactory` managing ɵresizer factory state and operations in `src/ux/windows/resizer/classes`.
 * @zh 可注入的 Angular 服务 `ɵResizerFactory`，管理 `src/ux/windows/resizer/classes` 中的ɵResizer工厂状态与业务操作。
 */
@Injectable()
export class ɵResizerFactory {
    /**
     * Property `resizers` (`any[]`) storing resizers.
     * @zh 属性 `resizers`（类型：`any[]`），用于存储或配置尺寸调整器。
     */
    private readonly resizers = [
        ɵTopLeftResizer,
        ɵTopResizer,
        ɵTopRightResizer,
        ɵLeftResizer,
        ɵRightResizer,
        ɵBottomLeftResizer,
        ɵBottomResizer,
        ɵBottomRightResizer
    ];

    /**
     * Creates an instance of `ɵResizerFactory` and initializes its dependencies and internal state.
     * @zh 创建 `ɵResizerFactory` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        private readonly injector: Injector
    ) {}

    /**
     * Executes `create` to handle create.
     * @zh 执行 `create`，用于创建。
     * @param id - id parameter (`ResizerEnum`) / 唯一标识参数（`ResizerEnum`）
     * @param context - context parameter (`ResizableDirective`) / 上下文参数（`ResizableDirective`）
     * @returns Result of type `ɵBaseResizer` / 类型为 `ɵBaseResizer` 的返回值
     */
    public create(id: ResizerEnum, context: ResizableDirective): ɵBaseResizer {
        const ResizerType = this.resizers
            .find((resizer) => resizer.id === id);

        return new ResizerType(context, this.injector);
    }
}
