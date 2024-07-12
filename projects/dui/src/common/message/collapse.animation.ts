import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationTriggerMetadata,
  AUTO_STYLE,
  query,
  animateChild,
  group,
} from '@angular/animations';

export interface IAnimationOptions {
  anchor?: string;
  duration?: number;
  delay?: number;
}

export interface ICollapseAnimation extends IAnimationOptions {
  easeOnClose?: string;
  easeOnOpen?: string;
}

export const duiCollapseAnimation: AnimationTriggerMetadata = trigger(
  'duiCollapse',
  [
    state(
      '1',
      style({
        height: '0',
        overflow: 'hidden',
      })
    ),
    state(
      '0',
      style({
        height: AUTO_STYLE,
        overflow: AUTO_STYLE,
      })
    ),
    transition(
      '0 => 1',
      [
        style({
          overflow: 'hidden',
          height: AUTO_STYLE,
        }),
        group([
          query('@*', animateChild(), { optional: true }),
          animate(
            '{{ duration }}ms {{ delay }}ms {{ ease }}',
            style({
              height: '0',
              overflow: 'hidden',
            })
          ),
        ]),
      ],
      { params: { duration: 150, delay: '0', ease: 'ease-in' } }
    ),
    transition(
      '1 => 0',
      [
        style({
          height: '0',
          overflow: 'hidden',
        }),
        group([
          query('@*', animateChild(), { optional: true }),
          animate(
            '{{ duration }}ms {{ delay }}ms {{ ease }}',
            style({
              overflow: 'hidden',
              height: AUTO_STYLE,
            })
          ),
        ]),
      ],
      { params: { duration: 150, delay: '0', ease: 'ease-out' } }
    ),
  ]
);
