/**
 * @fileoverview Module `src/net/angular2-websocket.ts` providing angular2 websocket definitions and implementation.
 * @zh 模块文件 `src/net/angular2-websocket.ts`，提供angular2websocket相关的定义与实现。
 */


import { Observable, Subject } from 'rxjs';

/**
 * Class `$WebSocket` encapsulating web socket data structures and logic in `src/net`.
 * @zh 类 `$WebSocket`，封装 `src/net` 中的WebSocket数据结构与处理逻辑。
 */
export class $WebSocket {

  /**
   * Property `Helpers` (`any`) storing helpers.
   * @zh 属性 `Helpers`（类型：`any`），用于存储或配置辅助工具。
   */
  private static Helpers = class {
    static isPresent(obj: unknown): boolean {
      return obj !== undefined && obj !== null;
    }

    static isString(obj: unknown): boolean {
      return typeof obj === 'string';
    }

    static isArray(obj: unknown): boolean {
      return Array.isArray(obj);
    }

    static isFunction(obj: unknown): boolean {
      return typeof obj === 'function';
    }
  };

  /**
   * Property `reconnectAttempts` (`number`) storing reconnect attempts (default: `0`).
   * @zh 属性 `reconnectAttempts`（类型：`number`），用于存储或配置重连Attempts（默认值：`0`）。
   */
  private reconnectAttempts = 0;
  /**
   * Property `sendQueue` (`any[]`) storing send queue (default: `[]`).
   * @zh 属性 `sendQueue`（类型：`any[]`），用于存储或配置发送队列（默认值：`[]`）。
   */
  private sendQueue = [];
  /**
   * Property `onOpenCallbacks` (`any[]`) storing on open callbacks (default: `[]`).
   * @zh 属性 `onOpenCallbacks`（类型：`any[]`），用于存储或配置当打开回调函数（默认值：`[]`）。
   */
  private onOpenCallbacks = [];
  /**
   * Property `onMessageCallbacks` (`any[]`) storing on message callbacks (default: `[]`).
   * @zh 属性 `onMessageCallbacks`（类型：`any[]`），用于存储或配置当消息回调函数（默认值：`[]`）。
   */
  private onMessageCallbacks = [];
  /**
   * Property `onErrorCallbacks` (`any[]`) storing on error callbacks (default: `[]`).
   * @zh 属性 `onErrorCallbacks`（类型：`any[]`），用于存储或配置当错误回调函数（默认值：`[]`）。
   */
  private onErrorCallbacks = [];
  /**
   * Property `onCloseCallbacks` (`any[]`) storing on close callbacks (default: `[]`).
   * @zh 属性 `onCloseCallbacks`（类型：`any[]`），用于存储或配置当关闭回调函数（默认值：`[]`）。
   */
  private onCloseCallbacks = [];
  /**
   * Property `readyStateConstants` (`any`) storing ready state constants.
   * @zh 属性 `readyStateConstants`（类型：`any`），用于存储或配置就绪状态Constants。
   */
  private readyStateConstants = {
    'UNINITIALIZED': -1,
    'CONNECTING': 0,
    'OPEN': 1,
    'CLOSING': 2,
    'CLOSED': 3,
    'RECONNECT_ABORTED': 4
  };
  /**
   * Property `normalCloseCode` (`number`) storing normal close code (default: `1000`).
   * @zh 属性 `normalCloseCode`（类型：`number`），用于存储或配置normal关闭编码（默认值：`1000`）。
   */
  private normalCloseCode = 1000;
  /**
   * Property `reconnectableStatusCodes` (`any[]`) storing reconnectable status codes (default: `[4000]`).
   * @zh 属性 `reconnectableStatusCodes`（类型：`any[]`），用于存储或配置reconnectable状态编码（默认值：`[4000]`）。
   */
  private reconnectableStatusCodes = [4000];
  /**
   * Property `socket` (`WebSocket`) storing socket.
   * @zh 属性 `socket`（类型：`WebSocket`），用于存储或配置socket。
   */
  private socket: WebSocket;
  /**
   * Property `dataStream` (`Subject<any>`) storing data stream.
   * @zh 属性 `dataStream`（类型：`Subject<any>`），用于存储或配置数据流。
   */
  private dataStream: Subject<MessageEvent>;
  /**
   * Property `errorMessages` (`Subject<any>`) storing error messages.
   * @zh 属性 `errorMessages`（类型：`Subject<any>`），用于存储或配置错误消息列表。
   */
  private errorMessages: Subject<Event>;
  /**
   * Property `internalConnectionState` (`number`) storing internal connection state.
   * @zh 属性 `internalConnectionState`（类型：`number`），用于存储或配置内部连接状态。
   */
  private internalConnectionState: number;
  /**
   * Property `reconnectTimeoutId` (`any`) storing reconnect timeout id.
   * @zh 属性 `reconnectTimeoutId`（类型：`any`），用于存储或配置重连延时器唯一标识。
   */
  private reconnectTimeoutId: ReturnType<typeof setTimeout>;

  /**
   * Creates an instance of `$WebSocket` and initializes its dependencies and internal state.
   * @zh 创建 `$WebSocket` 实例，并初始化其依赖项与内部状态。
   * @param url - Injected or initial url (`string`) / 注入或传入的链接地址（`string`）
   * @param protocols - Injected or initial protocols (`Array<string>`) / 注入或传入的protocols（`Array<string>`）
   * @param config - Injected or initial config (`WebSocketConfig`) / 注入或传入的配置（`WebSocketConfig`）
   * @param binaryType - Injected or initial binary type (`BinaryType`) / 注入或传入的binary类型（`BinaryType`）
   */
  constructor(private url: string,
    private protocols?: Array<string>,
    private config?: WebSocketConfig,
    private binaryType?: BinaryType) {
    let match = new RegExp('wss?:\/\/').test(url);
    if (!match) {
      throw new Error('Invalid url provided');
    }
    this.config = Object.assign({ initialTimeout: 500, maxTimeout: 300000, reconnectIfNotNormalClose: false }, config);
    this.binaryType = binaryType || 'blob';
    this.dataStream = new Subject();
    this.errorMessages = new Subject();
    this.connect(true);
  }

  /**
   * Executes `connect` to handle connect.
   * @zh 执行 `connect`，用于连接。
   * @param force - force parameter (`any`) / force参数（`any`）
   */
  connect(force = false) {

    if (force || !this.socket || this.socket.readyState !== this.readyStateConstants.OPEN) {
      if (this.socket && (this.socket.readyState === this.readyStateConstants.OPEN || this.socket.readyState === this.readyStateConstants.CONNECTING)) {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onclose = null;
        this.socket.onerror = null;
        this.socket.close(this.normalCloseCode);
      }
      this.socket = this.protocols ? new WebSocket(this.url, this.protocols) : new WebSocket(this.url);
      this.socket.binaryType = this.binaryType;

      this.socket.onopen = (ev: Event) => {
        this.onOpenHandler(ev);
      };
      this.socket.onmessage = (ev: MessageEvent) => {
        this.onMessageHandler(ev);
        this.dataStream.next(ev);
      };
      this.socket.onclose = (ev: CloseEvent) => {
        this.onCloseHandler(ev);
      };

      this.socket.onerror = (ev: Event) => {
        this.onErrorHandler(ev);
        this.errorMessages.next(ev);
      };

    }
  }

  /**
   * Executes `getErrorStream` to handle get error stream.
   * @zh 执行 `getErrorStream`，用于获取错误流。
   * @returns Result of type `Subject<any>` / 类型为 `Subject<any>` 的返回值
   */
  getErrorStream(): Subject<Event> {
    return this.errorMessages;
  }

  /**
   * Run in Block Mode
   * Return true when can send and false in socket closed
   * param data
   *  {boolean}

   * @zh 执行 `send4Direct`，用于send4Direct。
   */
  send4Direct(data, binary?: boolean): boolean {
    if (this.getReadyState() !== this.readyStateConstants.OPEN
      && this.getReadyState() !== this.readyStateConstants.CONNECTING) {
      this.connect();
    }
    this.sendQueue.push({ message: data, binary: binary });
    if (this.socket.readyState === this.readyStateConstants.OPEN) {
      this.fireQueue();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Return Promise
   * When can Send will resolve Promise
   * When Socket closed will reject Promise
   * param data
   *  {Promise<any>}

   * @zh 执行 `send4Promise`，用于send4Promise。
   */
  send4Promise(data, binary?: boolean): Promise<unknown> {
    return new Promise(
      (resolve, reject) => {
        if (this.send4Direct(data, binary)) {
          return resolve(undefined);
        } else {
          return reject(Error('Socket connection has been closed'));
        }
      }
    )
  }

  /**
   * Return cold Observable
   * When can Send will complete observer
   * When Socket closed will error observer
   * param data
   *  {Observable<any>}

   * @zh 执行 `send4Observable`，用于send4可观察流。
   */
  send4Observable(data, binary?: boolean): Observable<unknown> {
    return Observable.create((observer) => {
      if (this.send4Direct(data, binary)) {
        return observer.complete();
      } else {
        return observer.error('Socket connection has been closed');
      }
    });
  }

  /**
   * Property `send4Mode` (`WebSocketSendMode`) storing send4 mode (default: `WebSocketSendMode.Observable`).
   * @zh 属性 `send4Mode`（类型：`WebSocketSendMode`），用于存储或配置send4模式（默认值：`WebSocketSendMode.Observable`）。
   */
  private send4Mode: WebSocketSendMode = WebSocketSendMode.Observable;

  /**
   * Set send(data) function return mode
   * param mode

   * @zh 执行 `setSend4Mode`，用于集合Send4模式。
   */
  setSend4Mode(mode: WebSocketSendMode): void {
    this.send4Mode = mode;
  }

  /**
   * Use {mode} mode to send {data} data
   * If no specify, Default SendMode is Observable mode
   * param data
   * param mode
   * param binary
   *  {any}

   * @zh 执行 `send`，用于发送。
   */
  send(data: unknown, mode?: WebSocketSendMode, binary?: boolean) {
    switch (typeof mode !== 'undefined' ? mode : this.send4Mode) {
      case WebSocketSendMode.Direct:
        return this.send4Direct(data, binary);
      case WebSocketSendMode.Promise:
        return this.send4Promise(data, binary);
      case WebSocketSendMode.Observable:
        return this.send4Observable(data, binary);
      default:
        throw Error('WebSocketSendMode Error.');
    }
  }

  /**
   * Executes `getDataStream` to handle get data stream.
   * @zh 执行 `getDataStream`，用于获取数据流。
   * @returns Result of type `Subject<any>` / 类型为 `Subject<any>` 的返回值
   */
  getDataStream(): Subject<MessageEvent> {
    return this.dataStream;
  }

  /**
   * Executes `onOpenHandler` to handle on open handler.
   * @zh 执行 `onOpenHandler`，用于当打开处理器。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  onOpenHandler(event: Event) {
    this.reconnectAttempts = 0;
    this.notifyOpenCallbacks(event);
    this.fireQueue();
  }

  /**
   * Executes `notifyOpenCallbacks` to handle notify open callbacks.
   * @zh 执行 `notifyOpenCallbacks`，用于通知打开回调函数。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  notifyOpenCallbacks(event) {
    for (let i = 0; i < this.onOpenCallbacks.length; i++) {
      this.onOpenCallbacks[i].call(this, event);
    }
  }

  /**
   * Executes `fireQueue` to handle fire queue.
   * @zh 执行 `fireQueue`，用于触发队列。
   */
  fireQueue() {
    while (this.sendQueue.length && this.socket.readyState === this.readyStateConstants.OPEN) {
      let data = this.sendQueue.shift();

      if (data.binary) {
        this.socket.send(data.message);
      } else {
        this.socket.send(
          $WebSocket.Helpers.isString(data.message) ? data.message : JSON.stringify(data.message)
        );
      }
    }
  }

  /**
   * Executes `notifyCloseCallbacks` to handle notify close callbacks.
   * @zh 执行 `notifyCloseCallbacks`，用于通知关闭回调函数。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  notifyCloseCallbacks(event) {
    for (let i = 0; i < this.onCloseCallbacks.length; i++) {
      this.onCloseCallbacks[i].call(this, event);
    }
  }

  /**
   * Executes `notifyErrorCallbacks` to handle notify error callbacks.
   * @zh 执行 `notifyErrorCallbacks`，用于通知错误回调函数。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  notifyErrorCallbacks(event) {
    for (let i = 0; i < this.onErrorCallbacks.length; i++) {
      this.onErrorCallbacks[i].call(this, event);
    }
  }

  /**
   * Executes `onOpen` to handle on open.
   * @zh 执行 `onOpen`，用于当打开。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   */
  onOpen(cb) {
    this.onOpenCallbacks.push(cb);
    return this;
  };

  /**
   * Executes `offOpen` to handle off open.
   * @zh 执行 `offOpen`，用于off打开。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   */
  offOpen(cb) {
    const idx = this.onOpenCallbacks.indexOf(cb);
    if (idx > -1) {
      this.onOpenCallbacks.splice(idx, 1);
    }
    return this;
  }

  /**
   * Executes `onClose` to handle on close.
   * @zh 执行 `onClose`，用于当关闭。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   */
  onClose(cb) {
    this.onCloseCallbacks.push(cb);
    return this;
  }

  /**
   * Executes `offClose` to handle off close.
   * @zh 执行 `offClose`，用于off关闭。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   */
  offClose(cb) {
    const idx = this.onCloseCallbacks.indexOf(cb);
    if (idx > -1) {
      this.onCloseCallbacks.splice(idx, 1);
    }
    return this;
  }

  /**
   * Executes `onError` to handle on error.
   * @zh 执行 `onError`，用于当错误。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   */
  onError(cb) {
    this.onErrorCallbacks.push(cb);
    return this;
  };

  /**
   * Executes `offError` to handle off error.
   * @zh 执行 `offError`，用于off错误。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   */
  offError(cb) {
    const idx = this.onErrorCallbacks.indexOf(cb);
    if (idx > -1) {
      this.onErrorCallbacks.splice(idx, 1);
    }
    return this;
  }

  /**
   * Executes `onMessage` to handle on message.
   * @zh 执行 `onMessage`，用于当消息。
   * @param callback - callback parameter (`any`) / 回调函数参数（`any`）
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  onMessage(callback, options?) {
    if (!$WebSocket.Helpers.isFunction(callback)) {
      throw new Error('Callback must be a function');
    }

    this.onMessageCallbacks.push({
      fn: callback,
      pattern: options ? options.filter : undefined,
      autoApply: options ? options.autoApply : true
    });
    return this;
  }

  /**
   * Executes `offMessage` to handle off message.
   * @zh 执行 `offMessage`，用于off消息。
   * @param callback - callback parameter (`any`) / 回调函数参数（`any`）
   */
  offMessage(callback) {
    const idx = this.onMessageCallbacks.findIndex((entry) => entry.fn === callback);
    if (idx > -1) {
      this.onMessageCallbacks.splice(idx, 1);
    }
    return this;
  }

  /**
   * Executes `onMessageHandler` to handle on message handler.
   * @zh 执行 `onMessageHandler`，用于当消息处理器。
   * @param message - message parameter (`MessageEvent`) / 消息参数（`MessageEvent`）
   */
  onMessageHandler(message: MessageEvent) {
    let currentCallback;
    for (let i = 0; i < this.onMessageCallbacks.length; i++) {
      currentCallback = this.onMessageCallbacks[i];
      currentCallback.fn.apply(this, [message]);
    }
  };

  /**
   * Executes `onCloseHandler` to handle on close handler.
   * @zh 执行 `onCloseHandler`，用于当关闭处理器。
   * @param event - event parameter (`CloseEvent`) / 事件参数（`CloseEvent`）
   */
  onCloseHandler(event: CloseEvent) {
    this.notifyCloseCallbacks(event);
    if ((this.config.reconnectIfNotNormalClose && event.code !== this.normalCloseCode)
      || this.reconnectableStatusCodes.indexOf(event.code) > -1) {
      this.reconnect();
    } else {
      this.sendQueue = [];
      this.dataStream.complete();
      this.errorMessages.complete();
    }
  };

  /**
   * Executes `onErrorHandler` to handle on error handler.
   * @zh 执行 `onErrorHandler`，用于当错误处理器。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  onErrorHandler(event) {
    this.notifyErrorCallbacks(event);
  };

  /**
   * Executes `reconnect` to handle reconnect.
   * @zh 执行 `reconnect`，用于重连。
   */
  reconnect() {
    this.close(true, true);
    let backoffDelay = this.getBackoffDelay(++this.reconnectAttempts);
    // let backoffDelaySeconds = backoffDelay / 1000;
    // console.log('Reconnecting in ' + backoffDelaySeconds + ' seconds');
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }
    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null;
      if (this.config.reconnectIfNotNormalClose) {
        this.connect()
      }
    }, backoffDelay);
    return this;
  }

  /**
   * Executes `close` to handle close.
   * @zh 执行 `close`，用于关闭。
   * @param force - force parameter (`boolean`) / force参数（`boolean`）
   * @param keepReconnectIfNotNormalClose - keep reconnect if not normal close parameter (`boolean`) / keep重连IfNotNormal关闭参数（`boolean`）
   */
  close(force: boolean = false, keepReconnectIfNotNormalClose?: boolean) {
    if (!keepReconnectIfNotNormalClose) {
      this.config.reconnectIfNotNormalClose = false;
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
      }
    }

    if (force || !this.socket.bufferedAmount) {
      this.socket.close(this.normalCloseCode);
    }
    return this;
  };

  // Exponential Backoff Formula by Prof. Douglas Thain
  // http://dthain.blogspot.co.uk/2009/02/exponential-backoff-in-distributed.html
  /**
   * Executes `getBackoffDelay` to handle get backoff delay.
   * @zh 执行 `getBackoffDelay`，用于获取Backoff延迟。
   * @param attempt - attempt parameter (`any`) / attempt参数（`any`）
   */
  getBackoffDelay(attempt) {
    let R = Math.random() + 1;
    let T = this.config.initialTimeout;
    let F = 2;
    let N = attempt;
    let M = this.config.maxTimeout;

    return Math.floor(Math.min(R * T * Math.pow(F, N), M));
  };

  /**
   * Executes `setInternalState` to handle set internal state.
   * @zh 执行 `setInternalState`，用于集合内部状态。
   * @param state - state parameter (`any`) / 状态参数（`any`）
   */
  setInternalState(state) {
    if (Math.floor(state) !== state || state < 0 || state > 4) {
      throw new Error('state must be an integer between 0 and 4, got: ' + state);
    }

    this.internalConnectionState = state;

  }

  /**
   * Executes `getReadyState` to handle get ready state.
   * @zh 执行 `getReadyState`，用于获取就绪状态。
   */
  getReadyState() {
    if (this.socket == null) {
      return this.readyStateConstants.UNINITIALIZED;
    }
    return this.internalConnectionState !== undefined ? this.internalConnectionState : this.socket.readyState;
  }
}

/**
 * Interface `WebSocketConfig` defining the contract and properties for web socket config.
 * @zh 接口 `WebSocketConfig`，定义WebSocket配置的数据结构契约与属性规范。
 */
export interface WebSocketConfig {
  /**
   * Property `initialTimeout` (`number`) storing initial timeout.
   * @zh 属性 `initialTimeout`（类型：`number`），用于存储或配置初始延时器。
   */
  initialTimeout?: number;
  /**
   * Property `maxTimeout` (`number`) storing max timeout.
   * @zh 属性 `maxTimeout`（类型：`number`），用于存储或配置最大值延时器。
   */
  maxTimeout?: number;
  /**
   * Property `reconnectIfNotNormalClose` (`boolean`) storing reconnect if not normal close.
   * @zh 属性 `reconnectIfNotNormalClose`（类型：`boolean`），用于存储或配置重连IfNotNormal关闭。
   */
  reconnectIfNotNormalClose?: boolean;
}

/**
 * Enumeration `WebSocketSendMode` defining supported web socket send mode constants.
 * @zh 枚举 `WebSocketSendMode`，定义支持的WebSocket发送模式常量集合。
 */
export enum WebSocketSendMode {
  /**
   * Enum member `WebSocketSendMode.Direct` representing direct.
   * @zh 枚举项 `WebSocketSendMode.Direct`，表示Direct。
   */
  Direct, Promise, Observable
}

/**
 * Type alias `BinaryType` representing binary type (`"blob" | "arraybuffer"`).
 * @zh 类型别名 `BinaryType`，表示Binary类型（`"blob" | "arraybuffer"`）。
 */
export type BinaryType = "blob" | "arraybuffer";
