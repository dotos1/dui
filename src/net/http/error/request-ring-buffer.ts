/**
 * @fileoverview 请求环形缓冲：保留最近 N 条请求摘要（不存请求体、URL 已脱敏），供错误上报与排障使用。
 * @zh 请求环形缓冲服务与拦截器。
 */

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { sanitizeUrl } from './platform-error';

/** 一条请求摘要 */
export interface RequestTraceEntry {
  /** 发起时间（毫秒时间戳） */
  time: number;
  method: string;
  /** 脱敏后的 URL（敏感查询参数的值已替换为 ***） */
  url: string;
  /** HTTP 状态码；断网 / 取消为 0 */
  status: number;
  /** 耗时（毫秒） */
  durationMs: number;
  /** 响应头 X-Request-ID 或错误体 request_id */
  requestId?: string;
}

/**
 * 请求环形缓冲服务：只保留最近 `capacity` 条（默认 20）。
 * @zh 请求环形缓冲服务。
 */
@Injectable({ providedIn: 'root' })
export class RequestRingBuffer {
  /** 容量 */
  capacity = 20;
  private entries: RequestTraceEntry[] = [];

  /** 追加一条记录，超出容量丢最旧的 */
  record(entry: RequestTraceEntry): void {
    this.entries.push(entry);
    if (this.entries.length > this.capacity) {
      this.entries.splice(0, this.entries.length - this.capacity);
    }
  }

  /** 读取快照（从旧到新，返回副本） */
  snapshot(): RequestTraceEntry[] {
    return this.entries.map(e => ({ ...e }));
  }

  /** 清空 */
  clear(): void {
    this.entries = [];
  }
}

/**
 * 记录每个请求的摘要到 `RequestRingBuffer`。应放在拦截器链最外层（第一个注册），这样记录到的是最终结果与总耗时。
 * 只记方法、脱敏 URL、状态、耗时、request_id，不碰请求体 / 响应体（request_id 仅从错误体读取）。
 * @zh 请求环形缓冲拦截器。
 */
@Injectable({ providedIn: 'root' })
export class RequestRingBufferInterceptor implements HttpInterceptor {
  constructor(private readonly buffer: RequestRingBuffer) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    const url = sanitizeUrl(req.urlWithParams);
    let status = 0;
    let requestId: string | undefined;
    let done = false;
    const finish = () => {
      if (done) {
        return;
      }
      done = true;
      this.buffer.record({ time: started, method: req.method, url, status, durationMs: Date.now() - started, requestId });
    };
    return new Observable<HttpEvent<unknown>>(subscriber => {
      const sub = next.handle(req).pipe(
        tap({
          next: (event: HttpEvent<unknown>) => {
            if (event.type === HttpEventType.Response) {
              const res = event as HttpResponse<unknown>;
              status = res.status;
              requestId = res.headers.get('X-Request-ID') ?? undefined;
            }
          },
          error: (err: { status?: number; headers?: { get(n: string): string | null }; error?: { request_id?: unknown } }) => {
            status = typeof err?.status === 'number' ? err.status : 0;
            const bodyId = err?.error && typeof err.error === 'object' ? err.error.request_id : undefined;
            requestId = err?.headers?.get?.('X-Request-ID') ?? (typeof bodyId === 'string' ? bodyId : undefined);
          },
        })
      ).subscribe({
        next: v => subscriber.next(v),
        error: (e: unknown) => { finish(); subscriber.error(e); },
        complete: () => { finish(); subscriber.complete(); },
      });
      // 被取消（组件销毁、switchMap）也记一条，status 保持 0
      return () => { finish(); sub.unsubscribe(); };
    });
  }
}
