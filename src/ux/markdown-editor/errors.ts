/**
 * @fileoverview Module `src/ux/markdown-editor/errors.ts` providing errors definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/errors.ts`，提供错误列表相关的定义与实现。
 */


/**
 * Interface `ErrorListenerCallback` defining the contract and properties for error listener callback.
 * @zh 接口 `ErrorListenerCallback`，定义错误监听器回调函数的数据结构契约与属性规范。
 */
export interface ErrorListenerCallback {
	(error): void;
}

/**
 * Interface `ErrorListenerUnbind` defining the contract and properties for error listener unbind.
 * @zh 接口 `ErrorListenerUnbind`，定义错误监听器解绑的数据结构契约与属性规范。
 */
export interface ErrorListenerUnbind {
	(): void;
}

/**
 * Class `ErrorHandler` encapsulating error handler data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `ErrorHandler`，封装 `src/ux/markdown-editor` 中的错误处理器数据结构与处理逻辑。
 */
export class ErrorHandler {
	/**
	 * Property `unexpectedErrorHandler` (`(e: any) => void`) storing unexpected error handler.
	 * @zh 属性 `unexpectedErrorHandler`（类型：`(e: any) => void`），用于存储或配置unexpected错误处理器。
	 */
	private unexpectedErrorHandler: (e) => void;
	/**
	 * Property `listeners` (`ErrorListenerCallback[]`) storing listeners.
	 * @zh 属性 `listeners`（类型：`ErrorListenerCallback[]`），用于存储或配置监听器列表。
	 */
	private listeners: ErrorListenerCallback[];

	/**
	 * Creates an instance of `ErrorHandler` and initializes its dependencies and internal state.
	 * @zh 创建 `ErrorHandler` 实例，并初始化其依赖项与内部状态。
	 */
	constructor() {
		this.listeners = [];
		this.unexpectedErrorHandler = function (e: { stack?; message? }) {
			setTimeout(() => {
				if (e.stack) {
					throw new Error(e.message + '\n\n' + e.stack);
				}
				throw e;
			}, 0);
		};
	}

	/**
	 * Executes `addListener` to handle add listener.
	 * @zh 执行 `addListener`，用于添加监听器。
	 * @param listener - listener parameter (`ErrorListenerCallback`) / 监听器参数（`ErrorListenerCallback`）
	 * @returns Result of type `ErrorListenerUnbind` / 类型为 `ErrorListenerUnbind` 的返回值
	 */
	public addListener(listener: ErrorListenerCallback): ErrorListenerUnbind {
		this.listeners.push(listener);
		return () => {
			this._removeListener(listener);
		};
	}

	/**
	 * Executes `emit` to handle emit.
	 * @zh 执行 `emit`，用于发出。
	 * @param e - e parameter (`any`) / e参数（`any`）
	 */
	private emit(e): void {
		this.listeners.forEach((listener) => {
			listener(e);
		});
	}

	/**
	 * Executes `_removeListener` to handle remove listener.
	 * @zh 执行 `_removeListener`，用于移除监听器。
	 * @param listener - listener parameter (`ErrorListenerCallback`) / 监听器参数（`ErrorListenerCallback`）
	 */
	private _removeListener(listener: ErrorListenerCallback): void {
		this.listeners.splice(this.listeners.indexOf(listener), 1);
	}

	/**
	 * Executes `setUnexpectedErrorHandler` to handle set unexpected error handler.
	 * @zh 执行 `setUnexpectedErrorHandler`，用于集合Unexpected错误处理器。
	 * @param newUnexpectedErrorHandler - new unexpected error handler parameter (`(e: any) => void`) / 新Unexpected错误处理器参数（`(e: any) => void`）
	 */
	public setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e) => void): void {
		this.unexpectedErrorHandler = newUnexpectedErrorHandler;
	}

	/**
	 * Executes `getUnexpectedErrorHandler` to handle get unexpected error handler.
	 * @zh 执行 `getUnexpectedErrorHandler`，用于获取Unexpected错误处理器。
	 * @returns Result of type `(e: any) => void` / 类型为 `(e: any) => void` 的返回值
	 */
	public getUnexpectedErrorHandler(): (e) => void {
		return this.unexpectedErrorHandler;
	}

	/**
	 * Executes `onUnexpectedError` to handle on unexpected error.
	 * @zh 执行 `onUnexpectedError`，用于当Unexpected错误。
	 * @param e - e parameter (`any`) / e参数（`any`）
	 */
	public onUnexpectedError(e): void {
		this.unexpectedErrorHandler(e);
		this.emit(e);
	}

	// For external errors, we don't want the listeners to be called
	/**
	 * Executes `onUnexpectedExternalError` to handle on unexpected external error.
	 * @zh 执行 `onUnexpectedExternalError`，用于当Unexpected外部错误。
	 * @param e - e parameter (`any`) / e参数（`any`）
	 */
	public onUnexpectedExternalError(e): void {
		this.unexpectedErrorHandler(e);
	}
}

/**
 * Constant/variable `errorHandler` defining error handler in `src/ux/markdown-editor`.
 * @zh 常量/变量 `errorHandler`，定义 `src/ux/markdown-editor` 中的错误处理器。
 */
export const errorHandler = new ErrorHandler();

/**
 * Executes `setUnexpectedErrorHandler` to handle set unexpected error handler.
 * @zh 执行 `setUnexpectedErrorHandler`，用于集合Unexpected错误处理器。
 * @param newUnexpectedErrorHandler - new unexpected error handler parameter (`(e: any) => void`) / 新Unexpected错误处理器参数（`(e: any) => void`）
 */
export function setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e) => void): void {
	errorHandler.setUnexpectedErrorHandler(newUnexpectedErrorHandler);
}

/**
 * Executes `onUnexpectedError` to handle on unexpected error.
 * @zh 执行 `onUnexpectedError`，用于当Unexpected错误。
 * @param e - e parameter (`any`) / e参数（`any`）
 * @returns Result of type `undefined` / 类型为 `undefined` 的返回值
 */
export function onUnexpectedError(e): undefined {
	// ignore errors from cancelled promises
	if (!isPromiseCanceledError(e)) {
		errorHandler.onUnexpectedError(e);
	}
	return undefined;
}

/**
 * Executes `onUnexpectedExternalError` to handle on unexpected external error.
 * @zh 执行 `onUnexpectedExternalError`，用于当Unexpected外部错误。
 * @param e - e parameter (`any`) / e参数（`any`）
 * @returns Result of type `undefined` / 类型为 `undefined` 的返回值
 */
export function onUnexpectedExternalError(e): undefined {
	// ignore errors from cancelled promises
	if (!isPromiseCanceledError(e)) {
		errorHandler.onUnexpectedExternalError(e);
	}
	return undefined;
}

/**
 * Interface `SerializedError` defining the contract and properties for serialized error.
 * @zh 接口 `SerializedError`，定义已序列化错误的数据结构契约与属性规范。
 */
export interface SerializedError {
	/**
	 * Property `$isError` (`true`) storing is error.
	 * @zh 属性 `$isError`（类型：`true`），用于存储或配置是否为错误。
	 */
	readonly $isError: true;
	/**
	 * Property `name` (`string`) storing name.
	 * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
	 */
	readonly name: string;
	/**
	 * Property `message` (`string`) storing message.
	 * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
	 */
	readonly message: string;
	/**
	 * Property `stack` (`string`) storing stack.
	 * @zh 属性 `stack`（类型：`string`），用于存储或配置栈。
	 */
	readonly stack: string;
}

/**
 * Executes `transformErrorForSerialization` to handle transform error for serialization.
 * @zh 执行 `transformErrorForSerialization`，用于转换错误用于Serialization。
 * @param error - error parameter (`Error`) / 错误参数（`Error`）
 * @returns Result of type `SerializedError` / 类型为 `SerializedError` 的返回值
 */
export function transformErrorForSerialization(error: Error): SerializedError;
/**
 * Executes `transformErrorForSerialization` to handle transform error for serialization.
 * @zh 执行 `transformErrorForSerialization`，用于转换错误用于Serialization。
 * @param error - error parameter (`any`) / 错误参数（`any`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function transformErrorForSerialization(error);
/**
 * Executes `transformErrorForSerialization` to handle transform error for serialization.
 * @zh 执行 `transformErrorForSerialization`，用于转换错误用于Serialization。
 * @param error - error parameter (`any`) / 错误参数（`any`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function transformErrorForSerialization(error) {
	if (error instanceof Error) {
		let { name, message } = error;
		const stack: string = (<{ stacktrace? }><unknown>error).stacktrace || (<{ stack? }><unknown>error).stack;
		return {
			$isError: true,
			name,
			message,
			stack
		};
	}

	// return as is
	return error;
}

// see https://github.com/v8/v8/wiki/Stack%20Trace%20API#basic-stack-traces
/**
 * Interface `V8CallSite` defining the contract and properties for v8 call site.
 * @zh 接口 `V8CallSite`，定义V8调用Site的数据结构契约与属性规范。
 */
export interface V8CallSite {
	/**
	 * Executes `getThis` to handle get this.
	 * @zh 执行 `getThis`，用于获取This。
	 * @returns Result of type `any` / 类型为 `any` 的返回值
	 */
	getThis();
	/**
	 * Executes `getTypeName` to handle get type name.
	 * @zh 执行 `getTypeName`，用于获取类型名称。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	getTypeName(): string;
	/**
	 * Executes `getFunction` to handle get function.
	 * @zh 执行 `getFunction`，用于获取函数。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	getFunction(): string;
	/**
	 * Executes `getFunctionName` to handle get function name.
	 * @zh 执行 `getFunctionName`，用于获取函数名称。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	getFunctionName(): string;
	/**
	 * Executes `getMethodName` to handle get method name.
	 * @zh 执行 `getMethodName`，用于获取方法名称。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	getMethodName(): string;
	/**
	 * Executes `getFileName` to handle get file name.
	 * @zh 执行 `getFileName`，用于获取文件名称。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	getFileName(): string;
	/**
	 * Executes `getLineNumber` to handle get line number.
	 * @zh 执行 `getLineNumber`，用于获取线段数字。
	 * @returns Result of type `number` / 类型为 `number` 的返回值
	 */
	getLineNumber(): number;
	/**
	 * Executes `getColumnNumber` to handle get column number.
	 * @zh 执行 `getColumnNumber`，用于获取列数字。
	 * @returns Result of type `number` / 类型为 `number` 的返回值
	 */
	getColumnNumber(): number;
	/**
	 * Executes `getEvalOrigin` to handle get eval origin.
	 * @zh 执行 `getEvalOrigin`，用于获取EvalOrigin。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	getEvalOrigin(): string;
	/**
	 * Executes `isToplevel` to handle is toplevel.
	 * @zh 执行 `isToplevel`，用于是否为Toplevel。
	 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
	 */
	isToplevel(): boolean;
	/**
	 * Executes `isEval` to handle is eval.
	 * @zh 执行 `isEval`，用于是否为Eval。
	 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
	 */
	isEval(): boolean;
	/**
	 * Executes `isNative` to handle is native.
	 * @zh 执行 `isNative`，用于是否为原生。
	 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
	 */
	isNative(): boolean;
	/**
	 * Executes `isConstructor` to handle is constructor.
	 * @zh 执行 `isConstructor`，用于是否为Constructor。
	 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
	 */
	isConstructor(): boolean;
	/**
	 * Executes `toString` to handle to string.
	 * @zh 执行 `toString`，用于转换为字符串。
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	toString(): string;
}

/**
 * Constant/variable `canceledName` defining canceled name in `src/ux/markdown-editor`.
 * @zh 常量/变量 `canceledName`，定义 `src/ux/markdown-editor` 中的已取消名称。
 */
const canceledName = 'Canceled';

/**
 * Executes `isPromiseCanceledError` to handle is promise canceled error.
 * @zh 执行 `isPromiseCanceledError`，用于是否为Promise已取消错误。
 * @param error - error parameter (`any`) / 错误参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isPromiseCanceledError(error): boolean {
	return error instanceof Error && error.name === canceledName && error.message === canceledName;
}

/**
 * Executes `canceled` to handle canceled.
 * @zh 执行 `canceled`，用于已取消。
 * @returns Result of type `Error` / 类型为 `Error` 的返回值
 */
export function canceled(): Error {
	const error = new Error(canceledName);
	error.name = error.message;
	return error;
}

/**
 * Executes `illegalArgument` to handle illegal argument.
 * @zh 执行 `illegalArgument`，用于illegalArgument。
 * @param name - name parameter (`string`) / 名称参数（`string`）
 * @returns Result of type `Error` / 类型为 `Error` 的返回值
 */
export function illegalArgument(name?: string): Error {
	if (name) {
		return new Error(`Illegal argument: ${name}`);
	} else {
		return new Error('Illegal argument');
	}
}

/**
 * Executes `illegalState` to handle illegal state.
 * @zh 执行 `illegalState`，用于illegal状态。
 * @param name - name parameter (`string`) / 名称参数（`string`）
 * @returns Result of type `Error` / 类型为 `Error` 的返回值
 */
export function illegalState(name?: string): Error {
	if (name) {
		return new Error(`Illegal state: ${name}`);
	} else {
		return new Error('Illegal state');
	}
}

/**
 * Executes `readonly` to handle readonly.
 * @zh 执行 `readonly`，用于是否只读。
 * @param name - name parameter (`string`) / 名称参数（`string`）
 * @returns Result of type `Error` / 类型为 `Error` 的返回值
 */
export function readonly(name?: string): Error {
	return name
		? new Error(`readonly property '${name} cannot be changed'`)
		: new Error('readonly property cannot be changed');
}

/**
 * Executes `disposed` to handle disposed.
 * @zh 执行 `disposed`，用于已释放。
 * @param what - what parameter (`string`) / what参数（`string`）
 * @returns Result of type `Error` / 类型为 `Error` 的返回值
 */
export function disposed(what: string): Error {
	const result = new Error(`${what} has been disposed`);
	result.name = 'DISPOSED';
	return result;
}

/**
 * Executes `getErrorMessage` to handle get error message.
 * @zh 执行 `getErrorMessage`，用于获取错误消息。
 * @param err - err parameter (`any`) / 错误参数（`any`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function getErrorMessage(err): string {
	if (!err) {
		return 'Error';
	}

	if (err.message) {
		return err.message;
	}

	if (err.stack) {
		return err.stack.split('\n')[0];
	}

	return String(err);
}
