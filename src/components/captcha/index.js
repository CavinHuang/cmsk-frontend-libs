import SliderCaptcha from './SlideCaptcha.vue'
import ClickWordCaptcha from './ClickWordCaptcha.vue'
SliderCaptcha.install = (Vue) => {
  Vue.component(SliderCaptcha.name, SliderCaptcha)
}
ClickWordCaptcha.install = (Vue) => {
  Vue.component(ClickWordCaptcha.name, ClickWordCaptcha)
}
export { SliderCaptcha, ClickWordCaptcha }
// # sourceMappingURL=index.js.map
