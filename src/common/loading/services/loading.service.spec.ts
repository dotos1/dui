import { Subject } from 'rxjs';
import { LoadingFactory, ILoadingRef } from './loading.factory';
import { LoadingService } from './loading.service';

/** F8：移除加载组件时对 Subject 用 complete()，订阅方能收到「流已结束」 */
describe('LoadingService.removeComponent', () => {
  function fakeRef(): ILoadingRef {
    const subject = new Subject<number>();
    return { subject, observable: subject.asObservable(), times: 0 };
  }

  it('移除时通知订阅方流已结束，并删除上下文', () => {
    const factory = jasmine.createSpyObj<LoadingFactory>('LoadingFactory', ['createFullScreenComponent']);
    factory.createFullScreenComponent.and.callFake(() => fakeRef());
    const service = new LoadingService(factory);
    service.create({ name: 'spec-loading' });
    const ref = service['_context']['spec-loading'];
    let completed = false;
    ref.subject.subscribe({ complete: () => (completed = true) });

    service.removeComponent('spec-loading');

    expect(completed).toBe(true);
    expect(ref.subject.closed).toBe(false); // complete 不会把 Subject 标成 closed（unsubscribe 才会）
    expect(service['_context']['spec-loading']).toBeUndefined();
  });
});
