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
import { IAnimationOptions } from '../common/interfaces';

export interface IFadeInOutAnimation extends IAnimationOptions {
  easeOnIn?: string;
  easeOnOut?: string;
}

export const FadeInOutAnimation: AnimationTriggerMetadata = trigger('duiFadeInOut', [
  state(
    '0',
    style({
      opacity: '0',
      visibility: 'hidden',
    }),
  ),
  state(
    '1',
    style({
      opacity: AUTO_STYLE,
      visibility: AUTO_STYLE,
    }),
  ),
  transition(
    '0 => 1',
    [
      group([
        query('@*', animateChild(), { optional: true }),
        animate('{{ duration }}ms {{ delay }}ms {{ easeOnIn }}'),
      ]),
    ],
    { params: { duration: 150, delay: '0', easeOnIn: 'ease-in' } },
  ),
  transition(
    '1 => 0',
    [
      group([
        query('@*', animateChild(), { optional: true }),
        animate('{{ duration }}ms {{ delay }}ms {{ easeOnOut }}'),
      ]),
    ],
    { params: { duration: 150, delay: '0', easeOnOut: 'ease-out' } },
  ),
]);
