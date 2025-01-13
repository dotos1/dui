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

export const FlashAnimation: AnimationTriggerMetadata = trigger('duiFlash', [
  state(
    '0',
    style({
      opacity: 1,
    }),
  ),
  state(
    '1',
    style({
      opacity: 1,
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
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0, offset: 0.25 }),
            style({ opacity: 1, offset: 0.5 }),
            style({ opacity: 0, offset: 0.75 }),
            style({ opacity: 1, offset: 1.0 }),
          ]),
        ),
      ]),
    ],
    { params: { duration: 500, delay: '0', ease: 'ease-out' } },
  ),
]);
