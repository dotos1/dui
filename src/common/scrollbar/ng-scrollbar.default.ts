import { NgScrollbarOptions } from './ng-scrollbar.model';

export const defaultOptions: NgScrollbarOptions = {
  trackClass: '',
  thumbClass: '',
  buttonClass: '',
  orientation: 'auto',
  appearance: 'native',
  visibility: 'native',
  position: 'native',
  trackScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false,
  buttons: false,
  hoverOffset: false
};


export const defaultScrollTimelinePolyfill: string = '/assets/polyfill/scroll-timeline-lite.js';
