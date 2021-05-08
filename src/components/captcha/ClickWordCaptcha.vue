<template>
  <div :class="mode==='pop'?'mask':''" v-if="value">
    <div :class="mode==='pop'?'verifybox':''" :style="{'max-width': imgSize.width.toString().indexOf('%') > -1 ?
    imgSize.width : parseInt(imgSize.width)+30+'px'}">
      <div class="verifybox-top"  v-if="mode==='pop'">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div class="verifybox-bottom" :style="{padding:mode==='pop'?'15px':'0'}">
        <!-- 验证码容器 -->
        <VerifySlide
          :type="verifyType"
          :image-info="imageInfo"
          :mode="mode"
          :check-status="checkStatus"
          :vSpace="vSpace"
          :explain="explain"
          :imgSize="imgSize"
          :barSize="barSize"
          :defaultImg = "defaultImg"
          :refresh="refresh"
          @actionEnd="actionEndHandle"
          @success="closeBox"
          @checkStatusChange="checkStatusChange"
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
import { Vue, Component, Prop, Ref, Model, Emit } from 'vue-property-decorator'
import VerifySlide from './Verify/VerifyPoints.vue'
import {
  CaptchaPositionType,
  ImageSizeType,
  ComponentType,
  ImageInfoType,
  CheckParamsType,
  CheckStatusType
} from '@/@types/component'

@Component({
  name: 'VueVerify',
  components: {
    VerifySlide
  }
})

export default class extends Vue {
  @Model('input', { type: Boolean, default: false }) public value!: boolean
  // 验证码出现类型 pop=>弹窗 fixed=>悬浮
  @Prop({ default: 'pop' }) private mode!: CaptchaPositionType
  // 验证码当前校验状态
  @Prop({ default: 'waiting' }) private checkStatus!: CheckStatusType
  // 距离顶部或者底部的距离
  @Prop({ default: 5 }) private vSpace!: number
  // 滑块说明文字
  @Prop() private explain!: string
  // 重新刷新的方法
  @Prop({ default: () => { return false } }) private refresh!: () => any
  // 图片大小
  @Prop({ default: () => ({ width: 310, height: 155 }) }) private imgSize!: ImageSizeType
  // 图片信息
  @Prop({ default: () => ({ backImgBase: '', blockBackImgBase: '' }) }) private imageInfo!: ImageInfoType
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

  @Emit('input')
  private input () {
    return false
  }

  public closeBox () {
    this.input()
    this.success()
  }

  @Emit('success')
  private success () {
    return true
  }

  @Emit('actionEnd')
  private actionEnd (data: CheckParamsType) {
    return data
  }

  private actionEndHandle (params: CheckParamsType) {
    this.actionEnd(params)
  }

  @Emit('checkStatusChange')
  private checkStatusChange (params: CheckStatusType) {
    return params
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
}
</script>
<style src="./verify.scss" lang="scss"></style>
