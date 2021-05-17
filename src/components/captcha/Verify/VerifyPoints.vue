<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div class="verify-img-panel" :style="{'width': setSize.imgWidth + 'px',
                                             'height': setSize.imgHeight + 'px',
                                             'background-size' : setSize.imgWidth + 'px '+ setSize.imgHeight + 'px',
                                             'margin-bottom': vSpace + 'px'}"
                                              >
        <div class="verify-refresh" style="z-index:3" @click="refreshHandler" v-show="showRefresh">
          <i class="iconfont icon-refresh"></i>
        </div>
          <img
            :src="pointBackImgBase?('data:image/png;base64,'+pointBackImgBase):defaultImg"
            ref="canvas"
            alt=""  style="width:100%;height:100%;display:block"
            @click="bindingClick?canvasClick($event):undefined">

          <div v-for="(tempPoint, index) in tempPoints" :key="index" class="point-area"
             :style="{
                'background-color':'#1abd6c',
                color:'#fff',
                'z-index':9999,
                width:'20px',
                height:'20px',
                'text-align':'center',
                'line-height':'20px',
                'border-radius': '50%',
                position:'absolute',
                top:parseInt(tempPoint.y - 10) + 'px',
                left:parseInt(tempPoint.x - 10) + 'px'
             }">
            {{index + 1}}
          </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div class="verify-bar-area" :style="{'width': setSize.imgWidth + 'px', 'color': barAreaColor, 'border-color':
    barAreaBorderColor, 'line-height': barSize.height + 'px'}">
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * VerifyPoints
 * @description 点选
 * */
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { resetSize } from './../utils/util'
import { aesEncrypt } from './../utils/ase'
import {
  CaptchaPositionType, CaptchaVerifyDataType,
  CheckParamsType,
  CheckStatusType,
  ImageInfoType,
  ImageSizeType, PointType,
  SetSizeType
} from '@/@types/component'

@Component({
  name: 'VerifyPoints'
})

export default class extends Vue {
  // 验证码出现类型 pop=>弹窗 fixed=>悬浮
  @Prop({ default: 'pop' }) private mode!: CaptchaPositionType
  // 验证码当前校验状态
  @Prop({ default: 'waiting' }) private checkStatus!: CheckStatusType
  // 图片信息
  @Prop({ default: () => ({ backImgBase: '', blockBackImgBase: '' }) }) private imageInfo!: ImageInfoType
  // 距离顶部或者底部的距离
  @Prop({ default: 5 }) private vSpace!: number
  // 重新刷新的方法
  @Prop({ default: () => { return false } }) private refresh!: () => any
  // 滑块说明文字
  @Prop({ default: '向右滑动完成验证' }) private explain!: string
  // 验证提示文字
  @Prop() private checkTips!: string
  // 图片大小
  @Prop({ default: () => ({ width: 310, height: 155 }) }) private imgSize!: ImageSizeType
  // 滑块的大小
  @Prop({ default: () => ({ width: 310, height: 40 }) }) private barSize!: ImageSizeType
  // 默认图片
  @Prop({ default: '' }) private defaultImg!: string

  // 后端返回的加密秘钥 字段
  private secretKey = ''
  // 默认需要点击的字数
  private checkNum = 3
  // 选中的坐标信息
  private fontPos:Array<PointType> = []
  // 用户点击的坐标
  private checkPosArr:Array<PointType> = []
  // 点击的记数
  private num = 1
  // 后端返回的唯一token值
  private backToken = ''
  // 后端获取到的背景图片
  private pointBackImgBase = ''
  private poinTextList: Array<string> = []
  // 提示词的背景颜色
  private tipsBackColor = ''
  // 提示词
  private tipWords = ''
  private text = ''
  private finishText = ''
  private setSize: SetSizeType = {
    imgHeight: 0,
    imgWidth: 0,
    barHeight: 0,
    barWidth: 0
  }

  private tempPoints: Array<PointType> = []
  private barAreaColor = ''
  private barAreaBorderColor = ''
  private showRefresh = true
  private bindingClick = true
  private captchaVerification = ''
  private captchaVerifyData: CaptchaVerifyDataType = {
    secretKey: '',
    backToken: '',
    distance: {
      x: 0,
      y: 0
    }
  }

  @Watch('imageInfo', { immediate: true, deep: true })
  private onChangeImageInfo (info: ImageInfoType) {
    this.pointBackImgBase = info.backImgBase
    this.backToken = info.backToken
    this.secretKey = info.secretKey
    this.poinTextList = info.wordList as Array<string>
    this.text = this.poinTextList && this.poinTextList.length ? '请依次点击【' + this.poinTextList.join(',') + '】' : ''
  }

  @Watch('checkStatus', { immediate: true })
  private onChangeCheckStatus (status: CheckStatusType) {
    if (status === 'success') {
      this.barAreaColor = '#4cae4c'
      this.barAreaBorderColor = '#5cb85c'
      this.text = '验证成功'
      this.bindingClick = false
      if (this.mode === 'pop') {
        setTimeout(() => {
          this.success()
          this.refreshHandler()
          this.checkStatusChange('waiting')
        }, 1500)
      }
    } else if (status === 'error') {
      this.barAreaColor = '#d9534f'
      this.barAreaBorderColor = '#d9534f'
      this.text = '验证失败'
      setTimeout(() => {
        this.refreshHandler()
        this.checkStatusChange('waiting')
      }, 1000)
    }
  }

  @Emit('checkStatusChange')
  private checkStatusChange (params: CheckStatusType) {
    return params
  }

  @Emit('success') private success () {
    return this.captchaVerification
    // return {
    //   captchaVerification: this.captchaVerification,
    //   captchaVerifyData: this.captchaVerifyData
    // }
  }

  private resetSize (vm: any): SetSizeType {
    return resetSize(vm, this.imgSize, this.barSize)
  }

  private init () {
    // 加载页面
    this.fontPos.splice(0, this.fontPos.length)
    this.checkPosArr.splice(0, this.checkPosArr.length)
    this.num = 1
    this.$nextTick(() => {
      this.setSize = this.resetSize(this) // 重新设置宽度高度
    })
  }

  /**
   * 点击图片
   * @param e
   */
  private canvasClick (e: MouseEvent) {
    this.checkPosArr.push(this.getMousePos(e))
    if (this.num === this.checkNum) {
      this.num = this.createPoint(this.getMousePos(e))
      // 按比例转换坐标值
      this.checkPosArr = this.pointTransfrom(this.checkPosArr, this.setSize)
      // 等创建坐标执行完
      setTimeout(() => {
        // 发送后端请求
        const data: CheckParamsType = {
          captchaType: 'clickWord',
          pointJson: this.secretKey ? aesEncrypt(JSON.stringify(this.checkPosArr), this.secretKey) : JSON.stringify(this.checkPosArr),
          token: this.backToken
        }
        this.captchaVerifyData = {
          secretKey: this.secretKey,
          backToken: this.backToken,
          checkPosArr: this.checkPosArr
        }
        this.captchaVerification = this.secretKey
          ? aesEncrypt(this.backToken + '---' + JSON.stringify(this.checkPosArr), this.secretKey) : this.backToken + '---' + JSON.stringify(this.checkPosArr)
        this.actionEnd(data)
      }, 400)
    }
    if (this.num < this.checkNum) {
      this.num = this.createPoint(this.getMousePos(e))
    }
  }

  @Emit('actionEnd')
  private actionEnd (params: CheckParamsType) {
    console.log(params)
    return params
  }

  // 获取坐标
  private getMousePos (e: MouseEvent) {
    const x = e.offsetX
    const y = e.offsetY
    return { x, y }
  }

  // 创建坐标点
  private createPoint (pos: PointType) {
    this.tempPoints.push(Object.assign({}, pos))
    return ++this.num
  }

  // 重新刷新
  private refreshHandler () {
    this.tempPoints.splice(0, this.tempPoints.length)
    this.barAreaColor = '#000'
    this.barAreaBorderColor = '#ddd'
    this.bindingClick = true
    this.fontPos.splice(0, this.fontPos.length)
    this.checkPosArr.splice(0, this.checkPosArr.length)
    this.num = 1
    this.refresh()
    this.text = ''
    this.showRefresh = true
  }

  // 坐标转换函数
  private pointTransfrom (pointArr: Array<PointType>, imgSize: SetSizeType) {
    const newPointArr: Array<PointType> = pointArr.map(p => {
      const x = Math.round(310 * p.x / parseInt(imgSize.imgWidth as string))
      const y = Math.round(155 * p.y / parseInt(imgSize.imgHeight as string))
      return { x, y }
    })
    return newPointArr
  }

  created () {
    this.init()
  }

  mounted () {
    // 禁止拖拽
    this.$el.addEventListener('selectstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }, false)
  }
}
</script>
