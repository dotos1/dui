import {
  trigger,
  state,
  style,
  keyframes,
  transition,
  animate,
  AnimationTriggerMetadata,
  query,
  animateChild,
  group,
} from '@angular/animations';

export const PulseAnimation: AnimationTriggerMetadata = trigger('duiPulse', [
  state(
    '0',
    style({
      transform: 'scale3d(1, 1, 1)',
    }),
  ),
  state(
    '1',
    style({
      transform: 'scale3d(1, 1, 1)',
    }),
  ),
  transition(
    '0 <=> 1',
    [
      group([
        query('@*', animateChild(), { optional: true }),
        animate(
          '{{ duration }}ms {{ delay }}ms {{ ease }}',
          keyframes([
            style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
            style({ transform: 'scale3d(1.05, 1.05, 1.05)', offset: 0.5 }),
            style({ transform: 'scale3d(1, 1, 1)', offset: 1.0 }),
          ]),
        ),
      ]),
    ],
    { params: { duration: 500, delay: '0', ease: 'ease-out' } },
  ),
]);
