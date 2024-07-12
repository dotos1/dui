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

export const HeadshakeAnimation: AnimationTriggerMetadata = trigger('duiHeadshake', [
  state(
    '0',
    style({
      transform: 'translateX(0)',
    }),
  ),
  state(
    '1',
    style({
      transform: 'translateX(0)',
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
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(-6px) rotateY(-9deg)', offset: 0.065 }),
            style({ transform: 'translateX(5px) rotateY(7deg)', offset: 0.185 }),
            style({ transform: 'translateX(-3px) rotateY(-5deg)', offset: 0.315 }),
            style({ transform: 'translateX(2px) rotateY(3deg)', offset: 0.435 }),
            style({ transform: 'translateX(0)', offset: 0.5 }),
          ]),
        ),
      ]),
    ],
    { params: { duration: 500, delay: '0', ease: 'ease-out' } },
  ),
]);
