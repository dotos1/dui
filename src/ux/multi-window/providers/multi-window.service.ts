/**
 * @fileoverview Module `src/ux/multi-window/providers/multi-window.service.ts` providing multi window service definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/providers/multi-window.service.ts`，提供多窗口服务相关的定义与实现。
 */

import { Inject, Injectable, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

import { WStorageService } from './storage.service';
import { defaultMultiWindowConfig, NGXMW_CONFIG } from './config.provider';
import { MultiWindowConfig } from '../types/multi-window.config';
import { AppWindow, KnownAppWindow, WindowData } from '../types/window.type';
import { Message, MessageTemplate, MessageType } from '../types/message.type';
import { MultiWindowRef } from '../providers/window.provider';
import { WindowSaveStrategy } from '../types/window-save-strategy.enum';

/**
 * Injectable Angular service `MultiWindowService` managing multi window service state and operations in `src/ux/multi-window/providers`.
 * @zh 可注入的 Angular 服务 `MultiWindowService`，管理 `src/ux/multi-window/providers` 中的多窗口服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class MultiWindowService {

  /**
   * Property `config` (`MultiWindowConfig`) storing config.
   * @zh 属性 `config`（类型：`MultiWindowConfig`），用于存储或配置配置。
   */
  private config: MultiWindowConfig;

  /**
   * Property `myWindow` (`WindowData`) storing my window.
   * @zh 属性 `myWindow`（类型：`WindowData`），用于存储或配置my窗口。
   */
  private myWindow: WindowData;

  /**
   * Property `heartbeatId` (`any`) storing heartbeat id (default: `null`).
   * @zh 属性 `heartbeatId`（类型：`any`），用于存储或配置heartbeat唯一标识（默认值：`null`）。
   */
  private heartbeatId = null;

  /**
   * Property `windowScanId` (`any`) storing window scan id (default: `null`).
   * @zh 属性 `windowScanId`（类型：`any`），用于存储或配置窗口Scan唯一标识（默认值：`null`）。
   */
  private windowScanId = null;

  /**
   * Property `knownWindows` (`KnownAppWindow[]`) storing known windows (default: `[]`).
   * @zh 属性 `knownWindows`（类型：`KnownAppWindow[]`），用于存储或配置known多窗口（默认值：`[]`）。
   */
  private knownWindows: KnownAppWindow[] = [];

  /**
   * Property `messageTracker` (`{ [key: string]: Subject<string>; }`) storing message tracker (default: `{}`).
   * @zh 属性 `messageTracker`（类型：`{ [key: string]: Subject<string>; }`），用于存储或配置消息Tracker（默认值：`{}`）。
   */
  private messageTracker: { [key: string]: Subject<string> } = {};


  /**
   * Property `outboxCache` (`{ [key: string]: Message; }`) storing outbox cache (default: `{}`).
   * @zh 属性 `outboxCache`（类型：`{ [key: string]: Message; }`），用于存储或配置outbox缓存（默认值：`{}`）。
   */
  private outboxCache: { [key: string]: Message } = {};

  /**
   * Property `messageSubject` (`Subject<Message>`) storing message subject (default: `new Subject<Message>()`).
   * @zh 属性 `messageSubject`（类型：`Subject<Message>`），用于存储或配置消息主题流（默认值：`new Subject<Message>()`）。
   */
  private messageSubject: Subject<Message> = new Subject<Message>();

  /**
   * Property `windowSubject` (`Subject<KnownAppWindow[]>`) storing window subject.
   * @zh 属性 `windowSubject`（类型：`Subject<KnownAppWindow[]>`），用于存储或配置窗口主题流。
   */
  private windowSubject: Subject<KnownAppWindow[]> = new BehaviorSubject<KnownAppWindow[]>(this.knownWindows);

  /**
   * Executes `generateId` to handle generate id.
   * @zh 执行 `generateId`，用于生成唯一标识。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private static generateId(): string {
    return new Date().getTime().toString(36).substr(-4) + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Executes `tryMatchWindowKey` to handle try match window key.
   * @zh 执行 `tryMatchWindowKey`，用于尝试匹配窗口键。
   * @param source - source parameter (`string`) / 源参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private tryMatchWindowKey(source: string): string {
    const nameRegex = new RegExp(
      this.config.keyPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + 'w_([a-z0-9]+)'
    );
    const match = source.match(nameRegex);
    if (match !== null) {
      return match[1];
    }
    return null;
  }

  /**
   * Executes `generatePayloadKey` to handle generate payload key.
   * @zh 执行 `generatePayloadKey`，用于生成Payload键。
   * @param options - { message id } parameter (`Message`) / {消息唯一标识}参数（`Message`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private generatePayloadKey({ messageId }: Message): string {
    return this.config.keyPrefix + 'payload_' + messageId;
  }

  /**
   * Executes `generateWindowKey` to handle generate window key.
   * @zh 执行 `generateWindowKey`，用于生成窗口键。
   * @param windowId - window id parameter (`string`) / 窗口唯一标识参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private generateWindowKey(windowId: string): string {
    return this.config.keyPrefix + 'w_' + windowId;
  }

  /**
   * Executes `isWindowKey` to handle is window key.
   * @zh 执行 `isWindowKey`，用于是否为窗口键。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isWindowKey(key: string): boolean {
    return key.indexOf(this.config.keyPrefix + 'w_') === 0;
  }

  /**
   * Creates an instance of `MultiWindowService` and initializes its dependencies and internal state.
   * @zh 创建 `MultiWindowService` 实例，并初始化其依赖项与内部状态。
   * @param customConfig - Injected or initial custom config (`MultiWindowConfig`) / 注入或传入的自定义配置（`MultiWindowConfig`）
   * @param location - Injected or initial location (`Location`) / 注入或传入的location（`Location`）
   * @param storageService - Injected or initial storage service (`WStorageService`) / 注入或传入的存储服务（`WStorageService`）
   * @param windowRef - Injected or initial window ref (`MultiWindowRef`) / 注入或传入的窗口引用（`MultiWindowRef`）
   */
  constructor(@Inject(NGXMW_CONFIG) customConfig: MultiWindowConfig,
    @Optional() private location: Location,
    private storageService: WStorageService,
    private windowRef: MultiWindowRef) {
    this.config = { ...defaultMultiWindowConfig, ...customConfig };

    let windowId: string;

    if (this.location) {
      windowId = this.tryMatchWindowKey(this.location.path(true));
    }
    if (!windowId && this.config.windowSaveStrategy !== WindowSaveStrategy.NONE) {
      const storedWindowData = this.windowRef.nativeWindow.name;
      if (this.config.windowSaveStrategy === WindowSaveStrategy.SAVE_BACKUP) {
        try {
          const storedJsonData = JSON.parse(storedWindowData);
          windowId = storedJsonData.ngxmw_id;
          this.windowRef.nativeWindow.name = storedJsonData.backup;
        } catch (ex) {
        }
      } else {
        windowId = this.tryMatchWindowKey(storedWindowData);
        if (this.config.windowSaveStrategy === WindowSaveStrategy.SAVE_WHEN_EMPTY) {
          this.windowRef.nativeWindow.name = '';
        }
      }
    }
    this.init(windowId);
    this.start();
    if(this.storageService.getLocalObject('parent-'+this.id)){
      let childWins=this.storageService.getLocalObject('parent-'+this.id) as string[];
      for(let windId of childWins){
        this.resetWindow(windId);
      }
    }
    if(this.storageService.getLocalObject('child-'+this.id)){
      let parentId=this.storageService.getLocalObject('child-'+this.id);
      this.resetWindow(parentId);
    }
  }

  /**
   * Gets the current name (`name: string`).
   * @zh 获取当前名称（`name: string`）。
   */
  get name(): string {
    return this.myWindow.name;
  }

  /**
   * Sets the name (`name`).
   * @zh 设置名称（`name`）。
   * @param value - New name value (`string`) / 新的名称值（`string`）
   */
  set name(value: string) {
    this.myWindow.name = value;
  }

  /**
   * Gets the current id (`id: string`).
   * @zh 获取当前唯一标识（`id: string`）。
   */
  get id(): string {
    return this.myWindow.id;
  }


  /**
   * Executes `onMessage` to handle on message.
   * @zh 执行 `onMessage`，用于当消息。
   * @returns Result of type `Observable<Message>` / 类型为 `Observable<Message>` 的返回值
   */
  public onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }


  /**
   * Executes `onWindows` to handle on windows.
   * @zh 执行 `onWindows`，用于当多窗口。
   * @returns Result of type `Observable<KnownAppWindow[]>` / 类型为 `Observable<KnownAppWindow[]>` 的返回值
   */
  public onWindows(): Observable<KnownAppWindow[]> {
    return this.windowSubject.asObservable();
  }


  /**
   * Executes `getKnownWindows` to handle get known windows.
   * @zh 执行 `getKnownWindows`，用于获取Known多窗口。
   */
  public getKnownWindows() {
    return this.knownWindows;
  }


  /**
   * Executes `start` to handle start.
   * @zh 执行 `start`，用于开始。
   */
  public start(): void {
    if (!this.heartbeatId) {
      this.heartbeatId = setInterval(this.heartbeat, this.config.heartbeat);
    }
    if (!this.windowScanId) {
      this.windowScanId = setInterval(this.scanForWindows, this.config.newWindowScan);
    }
  }


  /**
   * Executes `stop` to handle stop.
   * @zh 执行 `stop`，用于停止。
   */
  public stop(): void {
    if (this.heartbeatId) {
      clearInterval(this.heartbeatId);
      this.heartbeatId = null;
    }
    if (this.windowScanId) {
      clearInterval(this.windowScanId);
      this.windowScanId = null;
    }
  }

  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  public clear(): void {
    this.storageService.removeLocalItem(this.generateWindowKey(this.myWindow.id));
  }

  /**
   * Executes `sendMessage` to handle send message.
   * @zh 执行 `sendMessage`，用于发送消息。
   * @param recipientId - recipient id parameter (`string`) / recipient唯一标识参数（`string`）
   * @param event - event parameter (`string`) / 事件参数（`string`）
   * @param data - data parameter (`any`) / 数据参数（`any`）
   * @param payload - payload parameter (`any`) / payload参数（`any`）
   * @returns Result of type `Observable<string>` / 类型为 `Observable<string>` 的返回值
   */
  public sendMessage(recipientId: string, event: string, data, payload?): Observable<string> {
    const messageId = this.pushToOutbox({
      recipientId,
      type: MessageType.MESSAGE,
      event,
      data,
      payload,
    });
    this.messageTracker[messageId] = new Subject<string>();
    return this.messageTracker[messageId].asObservable();
  }

  /**
   * Executes `newWindow` to handle new window.
   * @zh 执行 `newWindow`，用于新窗口。
   * @returns Result of type `{ windowId: string; urlString: string; created: Observable<string>; }` / 类型为 `{ windowId: string; urlString: string; created: Observable<string>; }` 的返回值
   */
  public newWindow(): { windowId: string, urlString: string, created: Observable<string> } {
    if (this.location === null) {
      throw new Error('No Location Provider present');
    }
    const newWindowId = MultiWindowService.generateId();

    if(this.storageService.getLocalObject('parent-'+this.id)){
      let childWindows=this.storageService.getLocalObject('parent-'+this.id) as string[];
      childWindows.push(newWindowId);
      this.storageService.setLocalObject('parent-'+this.id,childWindows);
    }else{
      this.storageService.setLocalObject('parent-'+this.id,[newWindowId]);
    }
    this.storageService.setLocalObject('child-'+newWindowId,this.id);

    const messageId = this.pushToOutbox({
      recipientId: newWindowId,
      type: MessageType.PING,
      event: undefined,
      data: undefined,
      payload: undefined,
    });
    this.messageTracker[messageId] = new Subject<string>();

    return {
      windowId: newWindowId,
      urlString: this.generateWindowKey(newWindowId),
      created: this.messageTracker[messageId].pipe(ignoreElements()),
    };
  }

  /**
   * Executes `resetWindow` to handle reset window.
   * @zh 执行 `resetWindow`，用于重置窗口。
   * @param newWindowId - new window id parameter (`any`) / 新窗口唯一标识参数（`any`）
   */
  public resetWindow(newWindowId):void{
    const messageId = this.pushToOutbox({
      recipientId: newWindowId,
      type: MessageType.PING,
      event: undefined,
      data: undefined,
      payload: undefined,
    });
    this.messageTracker[messageId] = new Subject<string>();
  }

  /**
   * Executes `saveWindow` to handle save window.
   * @zh 执行 `saveWindow`，用于保存窗口。
   */
  public saveWindow(): void {
    if (this.config.windowSaveStrategy !== WindowSaveStrategy.NONE) {
      const windowId = this.generateWindowKey(this.id);
      if ((this.config.windowSaveStrategy === WindowSaveStrategy.SAVE_WHEN_EMPTY && !this.windowRef.nativeWindow.name)
        || this.config.windowSaveStrategy === WindowSaveStrategy.SAVE_FORCE) {
        this.windowRef.nativeWindow.name = windowId;
      } else if (this.config.windowSaveStrategy === WindowSaveStrategy.SAVE_BACKUP) {
        this.windowRef.nativeWindow.name = JSON.stringify({ ngxmw_id: windowId, backup: this.windowRef.nativeWindow.name });
      }
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param windowId - window id parameter (`string`) / 窗口唯一标识参数（`string`）
   */
  private init(windowId?: string): void {
    const windowKey = windowId
      ? this.generateWindowKey(windowId)
      : this.storageService.getWindowName();
    let windowData: WindowData | null = null;
    if (windowKey && this.isWindowKey(windowKey)) {
      windowData = this.storageService.getLocalObject<WindowData>(windowKey);
    }
    if (windowData !== null) {
      this.myWindow = {
        id: windowData.id,
        name: windowData.name,
        heartbeat: windowData.heartbeat,
      };
    } else {
      const myWindowId = windowId || MultiWindowService.generateId();
      this.myWindow = {
        id: myWindowId,
        name: 'AppWindow ' + myWindowId,
        heartbeat: -1,
      };
    }
    this.storageService.setWindowName(windowKey);
    this.scanForWindows();
    this.heartbeat();
  }

  /**
   * Executes `pushToOutbox` to handle push to outbox.
   * @zh 执行 `pushToOutbox`，用于推入转换为Outbox。
   * @param { recipientId, type, event, da... - { recipient id, type, event, da parameter (`MessageTemplate`) / {recipientId,type,event,da参数（`MessageTemplate`）
   * @param messageId - message id parameter (`string`) / 消息唯一标识参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private pushToOutbox({ recipientId, type, event, data, payload }: MessageTemplate,
    messageId: string = MultiWindowService.generateId()): string {
    if (recipientId === this.id) {
      throw new Error('Cannot send messages to self');
    }
    this.outboxCache[messageId] = {
      messageId,
      recipientId,
      senderId: this.myWindow.id,
      sendTime: new Date().getTime(),
      type,
      event,
      data,
      payload,
      send: false,
    };
    return messageId;
  }

  /**
   * Property `heartbeat` (`() => void`) storing heartbeat.
   * @zh 属性 `heartbeat`（类型：`() => void`），用于存储或配置heartbeat。
   */
  private heartbeat = () => {
    const now = new Date().getTime();
    const receivedMessages: string[] = [];
    this.knownWindows.forEach(windowData => {
      const appWindow = this.storageService.getLocalObject<AppWindow>(this.generateWindowKey(windowData.id));
      if (appWindow === null) {
        return;
      }
      if (appWindow.id === this.myWindow.id) {
        if (this.myWindow.heartbeat !== -1 && this.myWindow.heartbeat !== appWindow.heartbeat) {
          this.myWindow.id = MultiWindowService.generateId();
          console.warn('Window ' + appWindow.id + '  detected that there is probably another instance with' +
            ' this id, changed id to ' + this.myWindow.id);
          this.storageService.setWindowName(this.generateWindowKey(this.myWindow.id));
        }
        return;
      }
      if (now - appWindow.heartbeat > this.config.windowTimeout) {
        this.storageService.removeLocalItem(this.generateWindowKey(appWindow.id));
      }
      windowData.name = appWindow.name;
      windowData.heartbeat = appWindow.heartbeat;
      if (appWindow.messages && appWindow.messages.length > 0) {
        appWindow.messages.forEach(message => {
          if (message.recipientId !== this.myWindow.id) {
            return;
          }
          if (message.type === MessageType.MESSAGE_RECEIVED) {
            if (this.messageTracker[message.messageId]) {
              this.messageTracker[message.messageId].complete();
            }
            delete this.messageTracker[message.messageId];

            // Remove the message from the outbox, as the transfer is complete
            delete this.outboxCache[message.messageId];
          } else {
            receivedMessages.push(message.messageId);
            // Check whether we already processed that message. If that's the case we've got a 'message_received'
            // confirmation in our own outbox.

            if (!(this.outboxCache[message.messageId] &&
              this.outboxCache[message.messageId].type === MessageType.MESSAGE_RECEIVED)) {
              // We did not process that message

              // Create a new message for the message sender in the current window's
              // outbox that the message has been processed (reuse the message id for that)
              this.pushToOutbox({
                recipientId: message.senderId,
                type: MessageType.MESSAGE_RECEIVED,
                event: undefined,
              }, message.messageId);

              // Process it locally, unless it's just a PING message
              if (message.type !== MessageType.PING) {
                if (message.payload === true) {
                  // The message has a separate payload
                  const payloadKey = this.generatePayloadKey(message);
                  message.payload = this.storageService.getLocalObject(payloadKey);
                  this.storageService.removeLocalItem(payloadKey);
                }
                this.messageSubject.next(message);
              }
            }
          }
        });
      }
    });

    // Iterate over the outbox to clean it up, process timeouts and payloads
    Object.keys(this.outboxCache).forEach(messageId => {
      const message = this.outboxCache[messageId];
      if (message.type === MessageType.MESSAGE_RECEIVED && !receivedMessages.some(msgId => msgId === messageId)) {
        delete this.outboxCache[messageId];
      } else if (message.type !== MessageType.MESSAGE_RECEIVED && now - message.sendTime > this.config.messageTimeout) {
        delete this.outboxCache[messageId];
        if (this.messageTracker[messageId]) {
          this.messageTracker[messageId].error('Timeout');
        }
        delete this.messageTracker[messageId];
      } else if (message.type === MessageType.MESSAGE && message.send === false) {
        if (message.payload !== undefined && message.payload !== true) {
          this.storageService.setLocalObject(this.generatePayloadKey(message), message.payload);
          message.payload = true;
        }
        this.messageTracker[message.messageId].next(message.messageId);
        message.send = undefined;
      }
    });

    this.storageService.setLocalObject(this.generateWindowKey(this.myWindow.id), {
      heartbeat: now,
      id: this.myWindow.id,
      name: this.myWindow.name,
      messages: Object.keys(this.outboxCache).map(key => this.outboxCache[key]),
    });

    if (this.myWindow.heartbeat === -1) {
      this.scanForWindows();
    }

    this.myWindow.heartbeat = now;
  }

  /**
   * Property `scanForWindows` (`() => void`) storing scan for windows.
   * @zh 属性 `scanForWindows`（类型：`() => void`），用于存储或配置scan用于多窗口。
   */
  private scanForWindows = () => {
    this.knownWindows = this.storageService.getLocalObjects<WindowData>(
      this.storageService.getLocalItemKeys().filter((key) => this.isWindowKey(key)))
      .map(({ id, name, heartbeat }: WindowData) => {
        return {
          id,
          name,
          heartbeat,
          stalled: new Date().getTime() - heartbeat > this.config.heartbeat * 2,
          self: this.myWindow.id === id,
        };
      });
    this.windowSubject.next(this.knownWindows);
  }
}
