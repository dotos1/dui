/**
 * @fileoverview Module `src/ux/editor/Editor.ts` providing editor definitions and implementation.
 * @zh 模块文件 `src/ux/editor/Editor.ts`，提供编辑器相关的定义与实现。
 */

import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorProps, EditorView } from 'prosemirror-view';
import { Observable, Subject } from 'rxjs';


import EditorCommands from './EditorCommands';
import { schema as defaultSchema}  from './schema';
import { parseContent } from './parsers';
import getDefaultPlugins from './defaultPlugins';
import isNil from './utils/isNil';

/**
 * Type alias `JSONDoc` representing json doc (`Record<string, any>`).
 * @zh 类型别名 `JSONDoc`，表示JSON文档（`Record<string, any>`）。
 */
type JSONDoc = Record<string, unknown>;
/**
 * Type alias `Content` representing content (`string | null | JSONDoc`).
 * @zh 类型别名 `Content`，表示内容（`string | null | JSONDoc`）。
 */
type Content = string | null | JSONDoc;

/**
 * Interface `Options` defining the contract and properties for options.
 * @zh 接口 `Options`，定义配置选项的数据结构契约与属性规范。
 */
interface Options {
  /**
   * Property `content` (`Content`) storing content.
   * @zh 属性 `content`（类型：`Content`），用于存储或配置内容。
   */
  content?: Content;
  /**
   * Property `history` (`boolean`) storing history.
   * @zh 属性 `history`（类型：`boolean`），用于存储或配置历史记录。
   */
  history?: boolean;
  /**
   * Property `keyboardShortcuts` (`boolean`) storing keyboard shortcuts.
   * @zh 属性 `keyboardShortcuts`（类型：`boolean`），用于存储或配置键盘快捷键列表。
   */
  keyboardShortcuts?: boolean;
  /**
   * Property `inputRules` (`boolean`) storing input rules.
   * @zh 属性 `inputRules`（类型：`boolean`），用于存储或配置输入属性规则列表。
   */
  inputRules?: boolean;
  /**
   * Property `schema` (`Schema<any, any>`) storing schema.
   * @zh 属性 `schema`（类型：`Schema<any, any>`），用于存储或配置结构定义。
   */
  schema?: Schema;
  /**
   * Property `plugins` (`Plugin<any>[]`) storing plugins.
   * @zh 属性 `plugins`（类型：`Plugin<any>[]`），用于存储或配置plugins。
   */
  plugins?: Plugin[];
  /**
   * Property `nodeViews` (`{ [node: string]: NodeViewConstructor; }`) storing node views.
   * @zh 属性 `nodeViews`（类型：`{ [node: string]: NodeViewConstructor; }`），用于存储或配置节点视图。
   */
  nodeViews?: EditorProps['nodeViews'];
  /**
   * Property `attributes` (`{…})`) storing attributes.
   * @zh 属性 `attributes`（类型：`{…})`），用于存储或配置属性列表。
   */
  attributes?: EditorProps['attributes'];
  /**
   * Property `features` (`EditorFeatures`) storing features.
   * @zh 属性 `features`（类型：`EditorFeatures`），用于存储或配置features。
   */
  features?: EditorFeatures;
  /**
   * Property `handleScrollToSelection` (`(this: any, view: EditorView) => boolean`) storing handle scroll to selection.
   * @zh 属性 `handleScrollToSelection`（类型：`(this: any, view: EditorView) => boolean`），用于存储或配置连接手柄滚动转换为Selection。
   */
  handleScrollToSelection?: EditorProps['handleScrollToSelection'];
  /**
   * Property `linkValidationPattern` (`string`) storing link validation pattern.
   * @zh 属性 `linkValidationPattern`（类型：`string`），用于存储或配置链接校验模式/图案。
   */
  linkValidationPattern?: string;
}

/**
 * Interface `EditorFeatures` defining the contract and properties for editor features.
 * @zh 接口 `EditorFeatures`，定义编辑器Features的数据结构契约与属性规范。
 */
interface EditorFeatures {
  /**
   * Property `linkOnPaste` (`boolean`) storing link on paste.
   * @zh 属性 `linkOnPaste`（类型：`boolean`），用于存储或配置链接当粘贴。
   */
  linkOnPaste?: boolean;
  /**
   * Property `resizeImage` (`boolean`) storing resize image.
   * @zh 属性 `resizeImage`（类型：`boolean`），用于存储或配置调整尺寸图像。
   */
  resizeImage?: boolean;
}

/**
 * Constant/variable `defaultFeatures` defining default features in `src/ux/editor`.
 * @zh 常量/变量 `defaultFeatures`，定义 `src/ux/editor` 中的默认Features。
 */
const defaultFeatures = {
  linkOnPaste: true,
  resizeImage: true,
};

/**
 * Constant/variable `DEFAULT_OPTIONS` defining default options in `src/ux/editor`.
 * @zh 常量/变量 `DEFAULT_OPTIONS`，定义 `src/ux/editor` 中的默认配置选项。
 */
const DEFAULT_OPTIONS: Options = {
  content: null,
  history: true,
  keyboardShortcuts: true,
  inputRules: true,
  schema: defaultSchema,
  plugins: [],
  nodeViews: {},
  attributes: {},
  features: defaultFeatures,
  handleScrollToSelection: null,
  linkValidationPattern: '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/??([^#\n\r]*)?#?([^\n\r]*)|(mailto:.*[@].*)',
};

/**
 * Class `Editor` encapsulating editor data structures and logic in `src/ux/editor`.
 * @zh 类 `Editor`，封装 `src/ux/editor` 中的编辑器数据结构与处理逻辑。
 */
export class Editor {
  /**
   * Property `options` (`Options`) storing options.
   * @zh 属性 `options`（类型：`Options`），用于存储或配置配置选项。
   */
  private options: Options;
  /**
   * Property `view` (`EditorView`) storing view.
   * @zh 属性 `view`（类型：`EditorView`），用于存储或配置视图。
   */
  view: EditorView;

  /**
   * Creates an instance of `Editor` and initializes its dependencies and internal state.
   * @zh 创建 `Editor` 实例，并初始化其依赖项与内部状态。
   * @param options - Injected or initial options (`Options`) / 注入或传入的配置选项（`Options`）
   */
  constructor(options: Options = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.createEditor();
  }

  /**
   * Property `valueChangesSubject` (`Subject<JSONDoc>`) storing value changes subject (default: `new Subject<JSONDoc>()`).
   * @zh 属性 `valueChangesSubject`（类型：`Subject<JSONDoc>`），用于存储或配置值变更集合主题流（默认值：`new Subject<JSONDoc>()`）。
   */
  private valueChangesSubject = new Subject<JSONDoc>();
  /**
   * Property `updateSubject` (`Subject<EditorView>`) storing update subject (default: `new Subject<EditorView>()`).
   * @zh 属性 `updateSubject`（类型：`Subject<EditorView>`），用于存储或配置更新主题流（默认值：`new Subject<EditorView>()`）。
   */
  private updateSubject = new Subject<EditorView>();

  /**
   * Gets the current value changes (`valueChanges: Observable<JSONDoc>`).
   * @zh 获取当前值变更集合（`valueChanges: Observable<JSONDoc>`）。
   */
  get valueChanges(): Observable<JSONDoc> {
    return this.valueChangesSubject.asObservable();
  }

  /**
   * Gets the current update (`update: Observable<EditorView>`).
   * @zh 获取当前更新（`update: Observable<EditorView>`）。
   */
  get update(): Observable<EditorView> {
    return this.updateSubject.asObservable();
  }

  /**
   * Gets the current schema (`schema: Schema`).
   * @zh 获取当前结构定义（`schema: Schema`）。
   */
  get schema(): Schema {
    return this.options.schema || defaultSchema;
  }

  /**
   * Gets the current link validation pattern (`linkValidationPattern: string`).
   * @zh 获取当前链接校验模式/图案（`linkValidationPattern: string`）。
   */
  get linkValidationPattern(): string {
    return this.options.linkValidationPattern;
  }

  /**
   * Gets the current commands (`commands: EditorCommands`).
   * @zh 获取当前命令（`commands: EditorCommands`）。
   */
  get commands(): EditorCommands {
    return new EditorCommands(this.view);
  }

  /**
   * Gets the current features (`features: EditorFeatures`).
   * @zh 获取当前features（`features: EditorFeatures`）。
   */
  get features(): EditorFeatures {
    return { ...defaultFeatures, ...this.options.features };
  }

  /**
   * Executes `handleTransactions` to handle handle transactions.
   * @zh 执行 `handleTransactions`，用于连接手柄Transactions。
   * @param tr - tr parameter (`Transaction`) / tr参数（`Transaction`）
   */
  private handleTransactions(tr: Transaction): void {
    const state = this.view.state.apply(tr);
    this.view.updateState(state);

    this.updateSubject.next(this.view);

    if (!tr.docChanged && !tr.getMeta('FORCE_EMIT')) {
      return;
    }

    const json = state.doc.toJSON();
    this.valueChangesSubject.next(json);
  }

  /**
   * Executes `createEditor` to handle create editor.
   * @zh 执行 `createEditor`，用于创建编辑器。
   */
  private createEditor(): void {
    const { options, schema } = this;
    const { content = null, nodeViews } = options;
    const { history = true, keyboardShortcuts = true, inputRules = true } = options;

    const doc = parseContent(content, schema);

    const plugins: Plugin[] = options.plugins ?? [];
    const attributes: EditorProps['attributes'] = options.attributes ?? {};

    const defaultPlugins = getDefaultPlugins(schema, {
      history,
      keyboardShortcuts,
      inputRules,
    });

    this.view = new EditorView(null, {
      state: EditorState.create({
        doc,
        schema,
        plugins: [...defaultPlugins, ...plugins],
      }),
      nodeViews,
      dispatchTransaction: this.handleTransactions.bind(this),
      attributes,
      handleScrollToSelection: options.handleScrollToSelection,
    });
  }

  /**
   * Executes `setContent` to handle set content.
   * @zh 执行 `setContent`，用于集合内容。
   * @param content - content parameter (`Content`) / 内容参数（`Content`）
   */
  setContent(content: Content): void {
    if (isNil(content)) {
      return;
    }

    const { state } = this.view;
    const { tr, doc } = state;

    const newDoc = parseContent(content, this.schema);

    tr.replaceWith(0, state.doc.content.size, newDoc);

    // don't emit if both content is same
    if (doc.eq(tr.doc)) {
      return;
    }

    if (!tr.docChanged) {
      return;
    }

    this.view.dispatch(tr);
  }

  /**
   * Executes `registerPlugin` to handle register plugin.
   * @zh 执行 `registerPlugin`，用于注册Plugin。
   * @param plugin - plugin parameter (`Plugin<any>`) / plugin参数（`Plugin<any>`）
   */
  registerPlugin(plugin: Plugin): void {
    const { state } = this.view;
    const plugins = [...state.plugins, plugin];

    const newState = state.reconfigure({ plugins });
    this.view.updateState(newState);
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    this.view.destroy();
  }
}