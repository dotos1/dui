/**
 * @fileoverview Module `src/core/services/script-loader.service.ts` providing script loader service definitions and implementation.
 * @zh 模块文件 `src/core/services/script-loader.service.ts`，提供script加载器服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



/**
 * Interface `Scripts` defining the contract and properties for scripts.
 * @zh 接口 `Scripts`，定义Scripts的数据结构契约与属性规范。
 */
interface Scripts {
    /**
     * Property `name` (`string`) storing name.
     * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
     */
    name: string;
    /**
     * Property `src` (`string`) storing src.
     * @zh 属性 `src`（类型：`string`），用于存储或配置源路径。
     */
    src: string;
}

/**
 * Constant/variable `ScriptStore` defining script store in `src/core/services`.
 * @zh 常量/变量 `ScriptStore`，定义 `src/core/services` 中的Script状态仓库。
 */
export const ScriptStore: Scripts[] = [];

/**
 * Constant/variable `document` defining document in `src/core/services`.
 * @zh 常量/变量 `document`，定义 `src/core/services` 中的文档对象。
 */
declare const document;

/**
 * Injectable Angular service `ScriptLoaderService` managing script loader service state and operations in `src/core/services`.
 * @zh 可注入的 Angular 服务 `ScriptLoaderService`，管理 `src/core/services` 中的Script加载器服务状态与业务操作。
 */
@Injectable({providedIn: 'root'})
export class ScriptLoaderService {

    /**
     * Property `scripts` (`Record<string, { src: string; loaded: boolean; }>`) storing scripts (default: `{}`).
     * @zh 属性 `scripts`（类型：`Record<string, { src: string; loaded: boolean; }>`），用于存储或配置scripts（默认值：`{}`）。
     */
    /** 脚本名 → { 地址, 是否已加载 } */
    private scripts: Record<string, { src: string; loaded: boolean }> = {};
    /**
     * Property `pathMappings` (`Record<string, string>`) storing path mappings (default: `{}`).
     * @zh 属性 `pathMappings`（类型：`Record<string, string>`），用于存储或配置路径映射（默认值：`{}`）。
     */
    private pathMappings: Record<string, string> = {};

    /**
     * Creates an instance of `ScriptLoaderService` and initializes its dependencies and internal state.
     * @zh 创建 `ScriptLoaderService` 实例，并初始化其依赖项与内部状态。
     * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
     */
    constructor(private http: HttpClient) {
        ScriptStore.forEach((script: { name?: string; src?: string }) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    /**
     * Executes `load` to handle load.
     * @zh 执行 `load`，用于加载。
     * @param scripts - scripts parameter (`string[]`) / scripts参数（`string[]`）
     * @returns Result of type `Promise<void> | Promise<unknown[]>` / 类型为 `Promise<void> | Promise<unknown[]>` 的返回值
     */
    load(...scripts: string[]) {
        if (scripts && scripts.length) {
            return Promise.resolve()
                .then(() => this.pathMappings )
                .then(() => {
                    return Promise.all(scripts.map( s => {
                        return this.loadScript(s);
                    }));
                });
        }
        return Promise.resolve();
    }

    /**
     * Executes `loadScript` to handle load script.
     * @zh 执行 `loadScript`，用于加载Script。
     * @param name - name parameter (`string`) / 名称参数（`string`）
     */
    private loadScript(name: string) {
        return new Promise((resolve) => {
            if (this.scripts[name] && this.scripts[name].loaded) {
                resolve({ script: name, loaded: true });
                return;
            } else if (!this.scripts[name]) {
                this.scripts[name] = {
                    loaded: false,
                    src: name
                };
            }
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            let src = this.scripts[name].src;
            src = this.pathMappings[src] || src;

            script.src = src;

            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true });
                    }
                };
            } else {  //Others
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true });
                };
            }
            script.onerror = () => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
}
