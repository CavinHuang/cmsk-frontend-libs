import Vue from 'vue'
import { SliderCaptchaConstruct } from './SliderCaptha'
import { ClickWordCaptchaConstruct } from './ClickWordCaptha'

declare function install(vue: typeof Vue): void;

declare const _default: {
  install: typeof install;
}

export default _default

export class SliderCaptcha extends SliderCaptchaConstruct {}
export class ClickWordCaptcha extends ClickWordCaptchaConstruct {}

export * from './component'
