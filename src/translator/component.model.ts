/**
 * @fileoverview Module `src/translator/component.model.ts` providing component model definitions and implementation.
 * @zh 模块文件 `src/translator/component.model.ts`，提供组件模型相关的定义与实现。
 */


/**
 * Class `ComponentTranslationModel` encapsulating component translation model data structures and logic in `src/translator`.
 * @zh 类 `ComponentTranslationModel`，封装 `src/translator` 中的组件翻译文本模型数据结构与处理逻辑。
 */
export class ComponentTranslationModel {
    /**
     * Property `name` (`string`) storing name.
     * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
     */
    name: string;
    /**
     * Property `path` (`string`) storing path.
     * @zh 属性 `path`（类型：`string`），用于存储或配置路径。
     */
    path: string;
    /**
     * Property `json` (`string []`) storing json.
     * @zh 属性 `json`（类型：`string []`），用于存储或配置JSON。
     */
    json: string [];

    /**
     * Creates an instance of `ComponentTranslationModel` and initializes its dependencies and internal state.
     * @zh 创建 `ComponentTranslationModel` 实例，并初始化其依赖项与内部状态。
     * @param obj - Injected or initial obj (`any`) / 注入或传入的对象（`any`）
     */
    constructor(obj?) {
        this.name = obj && obj.name;
        this.path = obj && obj.path;
        this.json = obj && obj.json || [];
    }
}
