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

@Injectable({
  providedIn: 'root',
})
export class MultiWindowService {

  private config: MultiWindowConfig;

  private myWindow: WindowData;

  private heartbeatId = null;

  private windowScanId = null;

  private knownWindows: KnownAppWindow[] = [];

  private messageTracker: { [key: string]: Subject<string> } = {};


  private outboxCache: { [key: string]: Message } = {};

  private messageSubject: Subject<Message> = new Subject<Message>();

  private windowSubject: Subject<KnownAppWindow[]> = new BehaviorSubject<KnownAppWindow[]>(this.knownWindows);

  private static generateId(): string {
    return new Date().getTime().toString(36).substr(-4) + Math.random().toString(36).substr(2, 9);
  }

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

  private generatePayloadKey({ messageId }: Message): string {
    return this.config.keyPrefix + 'payload_' + messageId;
  }

  private generateWindowKey(windowId: string): string {
    return this.config.keyPrefix + 'w_' + windowId;
  }

  private isWindowKey(key: string): boolean {
    return key.indexOf(this.config.keyPrefix + 'w_') === 0;
  }

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
      let childWins:any=this.storageService.getLocalObject('parent-'+this.id);
      for(let windId of childWins){
        this.resetWindow(windId);
      }
    }
    if(this.storageService.getLocalObject('child-'+this.id)){
      let parentId=this.storageService.getLocalObject('child-'+this.id);
      this.resetWindow(parentId);
    }
  }

  get name(): string {
    return this.myWindow.name;
  }

  set name(value: string) {
    this.myWindow.name = value;
  }

  get id(): string {
    return this.myWindow.id;
  }


  public onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }


  public onWindows(): Observable<KnownAppWindow[]> {
    return this.windowSubject.asObservable();
  }


  public getKnownWindows() {
    return this.knownWindows;
  }


  public start(): void {
    if (!this.heartbeatId) {
      this.heartbeatId = setInterval(this.heartbeat, this.config.heartbeat);
    }
    if (!this.windowScanId) {
      this.windowScanId = setInterval(this.scanForWindows, this.config.newWindowScan);
    }
  }


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

  public clear(): void {
    this.storageService.removeLocalItem(this.generateWindowKey(this.myWindow.id));
  }

  public sendMessage(recipientId: string, event: string, data: any, payload?: any): Observable<string> {
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

  public newWindow(): { windowId: string, urlString: string, created: Observable<string> } {
    if (this.location === null) {
      throw new Error('No Location Provider present');
    }
    const newWindowId = MultiWindowService.generateId();

    if(this.storageService.getLocalObject(this.id)){
      let childWindows:any=this.storageService.getLocalObject(this.id);
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
                  message.payload = this.storageService.getLocalObject<any>(payloadKey);
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
