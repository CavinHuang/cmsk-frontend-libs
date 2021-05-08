<template>
  <div :class="mode==='pop'?'mask':''" v-show="showBox">
    <div :class="mode==='pop'?'verifybox':''" :style="{'max-width':parseInt(imgSize.width)+30+'px'}">
      <div class="verifybox-top"  v-if="mode==='pop'">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
        <div class="verifybox-bottom" :style="{padding:mode==='pop'?'15px':'0'}">
          <!-- 验证码容器 -->
          <components
            v-if="componentType"
            :is="componentType"
            :captchaType="captchaType"
            :type="verifyType"
            :mode="mode"
            :vSpace="vSpace"
            :explain="explain"
            :imgSize="imgSize"
            :blockSize="blockSize"
            :barSize="barSize"
            :defaultImg = "defaultImg"
            ref="instance"
          />
        </div>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'
import VerifySlide from './Verify/VerifySlide.vue'
import VerifyPoints from './Verify/VerifyPoints.vue'
import { CaptchaType, CaptchaPositionType, ImageSizeType, ComponentType } from '@/@types/component'

@Component({
  name: 'VueVerify',
  components: {
    VerifySlide,
    VerifyPoints
  }
})

export default class extends Vue {
  // 验证码类型 blockPuzzle=>滑块验证码 clickWord=>文字点击验证码
  @Prop({ required: true, default: 'blockPuzzle' }) private captchaType!: CaptchaType
  // 验证码出现类型 pop=>弹窗 fixed=>悬浮
  @Prop({ default: 'pop' }) private mode!: CaptchaPositionType
  // 距离顶部或者底部的距离
  @Prop({ default: 5 }) private vSpace!: number
  // 滑块说明文字
  @Prop() private explain!: string
  // 图片大小
  @Prop({ default: () => ({ width: 310, height: 155 }) }) private imgSize!: ImageSizeType
  // 小方块的大小
  @Prop({ default: () => ({ width: 50, height: 50 }) }) private blockSize!: ImageSizeType
  // 滑块的大小
  @Prop({ default: () => ({ width: 310, height: 40 }) }) private barSize!: ImageSizeType

  @Ref('instance') readonly componentInstance!: any

  // 组件显示状态
  private clickShow = true
  // 内部验证码类型
  private verifyType = '1'
  // 组件类型
  private componentType: ComponentType = 'VerifySlide'
  // 默认图片
  private defaultImg: string = require('@/assets/image/default.jpg')

  mounted () {
    this.uuid()
  }

  // 生成 uuid
  private uuid () {
    const s: Array<string | any> = []
    const hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    const slider = 'slider' + '-' + s.join('')
    const point = 'point' + '-' + s.join('')
    // 判断下是否存在 slider
    console.log(localStorage.getItem('slider'))
    if (!localStorage.getItem('slider')) {
      localStorage.setItem('slider', slider)
    }
    if (!localStorage.getItem('point')) {
      localStorage.setItem('point', point)
    }
  }

  /**
   * refresh
   * @description 刷新
   * */
  private refresh () {
    if (this.componentInstance.refresh) {
      this.componentInstance.refresh()
    }
  }

  public closeBox () {
    this.clickShow = false
    this.refresh()
  }

  private show () {
    if (this.mode === 'pop') {
      this.clickShow = true
    }
  }

  // ============== computed =====
  private get showBox () {
    if (this.mode === 'pop') {
      return this.clickShow
    } else {
      return true
    }
  }

  @Watch('captchaType', { immediate: true })
  onChangeCaptchaType (captchaType: CaptchaType) {
    switch (captchaType.toString()) {
      case 'blockPuzzle':
        this.verifyType = '2'
        this.componentType = 'VerifySlide'
        break
      case 'clickWord':
        this.verifyType = ''
        this.componentType = 'VerifyPoints'
        break
    }
  }
}
</script>
<style src="./verify.scss" lang="scss"></style>
