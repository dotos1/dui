// Extra variables that live on Global that
// will be replaced by webpack DefinePlugin
declare const ENV: string;
declare const APP_VERSION: string;
declare const IS_PRODUCTION: boolean;
declare const HMR: boolean;
declare const IS_DEV: boolean;

interface ErrorStackTraceLimit {
  stackTraceLimit: number;
}

// HACK: This is only for demo page hmr
interface AppWindow {
  state: any;
}

interface Window extends AppWindow {}

interface ErrorConstructor extends ErrorStackTraceLimit {}
