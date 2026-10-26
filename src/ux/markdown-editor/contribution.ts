/**
 * @fileoverview Module `src/ux/markdown-editor/contribution.ts` providing contribution definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/contribution.ts`，提供contribution相关的定义与实现。
 */


import {languages} from "monaco-editor";

/**
 * Interface `ILang` defining the contract and properties for i lang.
 * @zh 接口 `ILang`，定义I语言的数据结构契约与属性规范。
 */
interface ILang extends languages.ILanguageExtensionPoint {
	/**
	 * Property `loader` (`() => Promise<ILangImpl>`) storing loader.
	 * @zh 属性 `loader`（类型：`() => Promise<ILangImpl>`），用于存储或配置加载器。
	 */
	loader: () => Promise<ILangImpl>;
}

/**
 * Interface `ILangImpl` defining the contract and properties for i lang impl.
 * @zh 接口 `ILangImpl`，定义I语言实现的数据结构契约与属性规范。
 */
interface ILangImpl {
	/**
	 * Property `conf` (`languages.LanguageConfiguration`) storing conf.
	 * @zh 属性 `conf`（类型：`languages.LanguageConfiguration`），用于存储或配置conf。
	 */
	conf: languages.LanguageConfiguration;
	/**
	 * Property `language` (`languages.IMonarchLanguage`) storing language.
	 * @zh 属性 `language`（类型：`languages.IMonarchLanguage`），用于存储或配置语言。
	 */
	language: languages.IMonarchLanguage;
}

/**
 * Constant/variable `languageDefinitions` defining language definitions in `src/ux/markdown-editor`.
 * @zh 常量/变量 `languageDefinitions`，定义 `src/ux/markdown-editor` 中的语言Definitions。
 */
let languageDefinitions: { [languageId: string]: ILang } = {};

/**
 * Executes `_loadLanguage` to handle load language.
 * @zh 执行 `_loadLanguage`，用于加载语言。
 * @param languageId - language id parameter (`string`) / 语言唯一标识参数（`string`）
 * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
 */
function _loadLanguage(languageId: string): Promise<void> {
	const loader = languageDefinitions[languageId].loader;
	return loader().then((mod) => {
		languages.setMonarchTokensProvider(languageId, mod.language);
		languages.setLanguageConfiguration(languageId, mod.conf);
	});
}

/**
 * Constant/variable `languagePromises` defining language promises in `src/ux/markdown-editor`.
 * @zh 常量/变量 `languagePromises`，定义 `src/ux/markdown-editor` 中的语言Promises。
 */
let languagePromises: { [languageId: string]: Promise<void> } = {};

/**
 * Executes `loadLanguage` to handle load language.
 * @zh 执行 `loadLanguage`，用于加载语言。
 * @param languageId - language id parameter (`string`) / 语言唯一标识参数（`string`）
 * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
 */
export function loadLanguage(languageId: string): Promise<void> {
	if (!languagePromises[languageId]) {
		languagePromises[languageId] = _loadLanguage(languageId);
	}
	return languagePromises[languageId];
}

/**
 * Executes `registerLanguage` to handle register language.
 * @zh 执行 `registerLanguage`，用于注册语言。
 * @param def - def parameter (`ILang`) / def参数（`ILang`）
 */
export function registerLanguage(def: ILang): void {
	let languageId = def.id;

	languageDefinitions[languageId] = def;
	languages.register(def);
	languages.onLanguage(languageId, () => {
		loadLanguage(languageId);
	});
}
