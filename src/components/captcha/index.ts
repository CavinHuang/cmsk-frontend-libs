import SliderCaptcha from './SlideCaptcha.vue'
import ClickWordCaptcha from './ClickWordCaptcha.vue'

(SliderCaptcha as any).install = (Vue: any) => {
  Vue.component(SliderCaptcha.name, SliderCaptcha)
}

(ClickWordCaptcha as any).install = (Vue: any) => {
  Vue.component(ClickWordCaptcha.name, ClickWordCaptcha)
}

export {
  SliderCaptcha,
  ClickWordCaptcha
}
