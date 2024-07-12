import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';
import { MousePosition, SelectBox, SelectBoxInput, SelectContainerHost } from './models';
import { getRelativeMousePosition, hasMinimumSize } from './utils';

export const createSelectBox = (container: SelectContainerHost) => (
  source: Observable<SelectBoxInput>
): Observable<SelectBox<number>> =>
  source.pipe(
    map(([event, opacity, { x, y }]) => {
      const mousePosition: MousePosition = getRelativeMousePosition(event, container);

      const width = opacity > 0 ? mousePosition.x - x : 0;
      const height = opacity > 0 ? mousePosition.y - y : 0;

      return {
        top: height < 0 ? mousePosition.y : y,
        left: width < 0 ? mousePosition.x : x,
        width: Math.abs(width),
        height: Math.abs(height),
        opacity
      };
    })
  );

export const whenSelectBoxVisible = (selectBox$: Observable<SelectBox<number>>) => (source: Observable<Event>) =>
  source.pipe(
    withLatestFrom(selectBox$),
    filter(([, selectBox]) => hasMinimumSize(selectBox, 0, 0)),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([event, _]) => event)
  );

export const distinctKeyEvents = () => (source: Observable<KeyboardEvent>) =>
  source.pipe(
    distinctUntilChanged((prev, curr) => {
      return prev && curr && prev.code === curr.code;
    })
  );
