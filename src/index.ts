import { SliderCaptcha, ClickWordCaptcha } from './components'

const components: { [propsName: string]: any } = {
  SliderCaptcha,
  ClickWordCaptcha
}

const install = (Vue: any) => {
  console.log('调用装载函数', components)
  if ((install as any).installed) return
  (install as any).installed = true
  // 安装全部的插件
  Object.keys(components).forEach((key) => {
    console.log('装载：' + key)
    Vue.component(key, components[key])
  })
}
// 这一步判断window.Vue是否存在，因为直接引用vue.min.js， 它会把Vue绑到Window上，我们直接引用打包好的js才能正常跑起来。
if (typeof window !== 'undefined' && (window as any).Vue) {
  // window.Vue.use(install)
  install((window as any).Vue)
}

export default {
  install
}

export {
  SliderCaptcha,
  ClickWordCaptcha
}
