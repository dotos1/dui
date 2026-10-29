/**
 * @fileoverview Module `src/ux/link-preview/services/link-preview-loading.manager.ts` providing link preview loading manager definitions and implementation.
 * @zh 模块文件 `src/ux/link-preview/services/link-preview-loading.manager.ts`，提供链接预览加载中管理器相关的定义与实现。
 */

import { BehaviorSubject } from 'rxjs';

/**
 * Class `LinkPreviewLoadingManager` encapsulating link preview loading manager data structures and logic in `src/ux/link-preview/services`.
 * @zh 类 `LinkPreviewLoadingManager`，封装 `src/ux/link-preview/services` 中的链接预览加载中管理器数据结构与处理逻辑。
 */
export class LinkPreviewLoadingManager {
   /**
    * The loading stack, holding an item for each
    * @zh 属性 `loadingStack`（类型：`string[]`），用于存储或配置加载中栈（默认值：`[]`）。
    */
   private loadingStack: string[] = [];

   /**
    * Observable to retrieve if has pending jobs
    * @zh 属性 `hasPendingJobs$`（类型：`BehaviorSubject<boolean>`），用于存储或配置是否包含等待中Jobs（默认值：`new BehaviorSubject(false)`）。
    */
   public hasPendingJobs$ = new BehaviorSubject(false);

   /**
    * Creates an instance of `LinkPreviewLoadingManager` and initializes its dependencies and internal state.
    * @zh 创建 `LinkPreviewLoadingManager` 实例，并初始化其依赖项与内部状态。
    */
   constructor() {}

   /**
    * Add task to stack

    * @zh 执行 `addTask`，用于添加任务。
    */
   public addTask(name?: string): void {
      name = this.getTaskName(name);
      this.loadingStack.push(name);
      this.emitHasPendingJobs();
   }

   /**
    * Remove task from stack

    * @zh 执行 `removeTask`，用于移除任务。
    */
   public removeTask(name?: string): void {
      name = this.getTaskName(name);
      if (this.loadingStack.length) {
         const taskIndex = this.loadingStack.indexOf(name);
         if (taskIndex !== -1) {
            this.loadingStack.splice(taskIndex, 1);
         } else {
            console.error(`[LinkPreviewLoadingManager] Task [${name}] not found and can't be removed.`);
         }
      } else {
         console.error('[LinkPreviewLoadingManager] No pending task available for remove');
      }
      this.emitHasPendingJobs();
   }

   /**
    * Get task name

    * @zh 执行 `getTaskName`，用于获取任务名称。
    */
   private getTaskName(name: string): string {
      return name ? name : 'UNKNOWN_TASK';
   }

   /**
    * Emit if has loading jobs

    * @zh 执行 `emitHasPendingJobs`，用于发出是否包含等待中Jobs。
    */
   private emitHasPendingJobs(): void {
      if (this.loadingStack.length) {
         this.hasPendingJobs$.next(true);
      } else {
         this.hasPendingJobs$.next(false);
      }
   }
}
