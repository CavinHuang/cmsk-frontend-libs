<template>
  <div style="position: relative;">
    <div class="verify-img-out" :style="{height: (parseInt(setSize.imgHeight) + vSpace) + 'px'}">
      <div class="verify-img-panel" :style="{width: setSize.imgWidth + 'px', height: setSize.imgHeight + 'px',}">
        <img :src="backImgBase ? ('data:image/png;base64,'+backImgBase):defaultImg" alt="" style="width:100%;height:100%;display:block">
        <div class="verify-refresh" @click="refresh" v-show="showRefresh"><i class="iconfont icon-refresh"></i>
        </div>
        <transition name="tips">
          <span class="verify-tips" v-if="tipWords" :class="passFlag ?'suc-bg':'err-bg'">{{tipWords}}</span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div class="verify-bar-area" :style="{width: setSize.imgWidth + 'px', height: barSize.height + 'px', 'line-height': barSize.height + 'px'}">
      <span class="verify-msg" v-text="text"></span>
      <div class="verify-left-bar" :style="{width: leftBarWidth ? leftBarWidth + 'px' : barSize.height + 'px', height: barSize.height + 'px', 'border-color': leftBarBorderColor, transaction: transitionWidth}">
        <span class="verify-msg" v-text="finishText"></span>
        <div class="verify-move-block"
             @touchstart="start"
             @mousedown="start"
             :style="{width: (barSize.height + 2) + 'px', height: (barSize.height + 2) + 'px', 'background-color': moveBlockBackgroundColor, left: moveBlockLeft + 'px', transition: transitionLeft}">
          <i :class="['verify-icon iconfont', iconClass]" :style="{color: iconColor}"></i>
          <div class="verify-sub-block" :style="{'width':Math.floor(parseInt(setSize.imgWidth)*47/310)+ 'px',
                        'height': setSize.imgHeight + 'px',
                        'top':'-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
                        'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
                        }">
            <img :src="'data:image/png;base64,'+blockBackImgBase" alt=""  style="width:100%;height:100%;display:block">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * VerifySlide
 * @description 滑块
 */
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { aesEncrypt } from '../utils/ase'
import { resetSize } from '../utils/util'
import {
  CaptchaPositionType, CaptchaVerifyDataType,
  CheckParamsType,
  CheckStatusType,
  ImageInfoType,
  ImageSizeType,
  SetSizeType
} from '@/@types/component'

@Component({
  name: 'VerifySlide'
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
  // 小方块的大小
  @Prop({ default: () => ({ width: 50, height: 50 }) }) private blockSize!: ImageSizeType
  // 滑块的大小
  @Prop({ default: () => ({ width: 310, height: 40 }) }) private barSize!: ImageSizeType
  // 默认图片
  @Prop({ default: '' }) private defaultImg!: string

  // 后端返回的加密秘钥 字段
  private secretKey = ''
  // 是否通过的标识
  private passFlag = false
  // 验证码背景图片
  private backImgBase = ''
  // 验证滑块的背景图片
  private blockBackImgBase = ''
  // 后端返回的唯一token值
  private backToken = ''
  // 移动开始的时间
  private endMovetime = 0
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

  private moveBlockLeft = 0
  private leftBarWidth = 0
  private moveBlockBackgroundColor = ''
  private leftBarBorderColor = '#ddd'
  private iconColor = ''
  private iconClass = 'icon-right'
  private status = false
  private isEnd = false
  private showRefresh = false
  private transitionLeft = ''
  private transitionWidth = ''
  private startMoveTime = 0
  private startLeft = 0
  private captchaVerification = ''
  private captchaVerifyData: CaptchaVerifyDataType = {
    secretKey: '',
    backToken: '',
    distance: {
      x: 0,
      y: 0
    }
  }

  @Emit('checkStatusChange')
  private checkStatusChange (params: CheckStatusType) {
    return params
  }

  @Watch('imageInfo', { immediate: true, deep: true })
  private onChangeImageInfo (info: ImageInfoType) {
    this.backImgBase = info.backImgBase
    this.blockBackImgBase = info.blockBackImgBase
    this.backToken = info.backToken
    this.secretKey = info.secretKey
  }

  @Watch('checkTips', { immediate: true })
  private onChangeCheckTips (tips: string) {
    this.tipWords = tips
  }

  @Watch('checkStatus', { immediate: true })
  private onChangeCheckStatus (status: CheckStatusType) {
    if (status === 'success') {
      this.moveBlockBackgroundColor = '#5cb85c'
      this.leftBarBorderColor = '#5cb85c'
      this.iconColor = '#fff'
      this.iconClass = 'icon-check'
      this.showRefresh = false
      this.isEnd = true
      if (this.mode === 'pop') {
        setTimeout(() => {
          this.refreshHandler()
          this.success()
        }, 1500)
      }
      this.passFlag = true
      this.tipWords = `${((this.endMovetime - this.startMoveTime) / 1000).toFixed(2)}s验证成功`
      setTimeout(() => {
        this.tipWords = ''
        this.success()
        this.checkStatusChange('waiting')
        this.captchaVerification = ''
      }, 1000)
    } else if (status === 'error') {
      this.moveBlockBackgroundColor = '#d9534f'
      this.leftBarBorderColor = '#d9534f'
      this.iconColor = '#fff'
      this.iconClass = 'icon-close'
      this.passFlag = false
      this.tipWords = '验证失败'
      setTimeout(() => {
        this.tipWords = ''
        this.refreshHandler()
        this.checkStatusChange('waiting')
      }, 1000)
    }
  }

  @Emit('success')
  private success () {
    return {
      captchaVerification: this.captchaVerification,
      captchaVerifyData: this.captchaVerifyData
    }
  }

  private get barArea () {
    return this.$el.querySelector('.verify-bar-area') as HTMLDivElement
  }

  private resetSize (vm: any): SetSizeType {
    return resetSize(vm, this.imgSize, this.barSize)
  }

  created () {
    this.init()
  }

  /**
   * 初始化函数
   */
  private init () {
    this.text = this.explain
    this.$nextTick(() => {
      const setSize = this.resetSize(this) // 重新设置宽度高度
      for (const key in setSize) {
        this.$set(this.setSize, key, setSize[key])
      }
      this.$parent.$emit('ready', this)
    })

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this

    window.removeEventListener('touchmove', function (e) {
      _this.move(e)
    })
    window.removeEventListener('mousemove', function (e) {
      _this.move(e)
    })

    // 鼠标松开
    window.removeEventListener('touchend', function () {
      _this.end()
    })
    window.removeEventListener('mouseup', function () {
      _this.end()
    })

    window.addEventListener('touchmove', function (e) {
      _this.move(e)
    })
    window.addEventListener('mousemove', function (e) {
      _this.move(e)
    })

    // 鼠标松开
    window.addEventListener('touchend', function () {
      _this.end()
    })
    window.addEventListener('mouseup', function () {
      _this.end()
    })
  }

  // 鼠标按下
  private start (e: TouchEvent | MouseEvent) {
    console.log(e, e instanceof TouchEvent)
    let x
    if (e instanceof TouchEvent) { // 兼容PC端
      x = e.touches[0].pageX
    } else {
      x = e.clientX
    }
    this.startLeft = Math.floor(x - this.barArea.getBoundingClientRect().left)
    this.startMoveTime = +new Date() // 开始滑动的时间
    if (!this.isEnd) {
      this.text = ''
      this.moveBlockBackgroundColor = '#337ab7'
      this.leftBarBorderColor = '#337AB7'
      this.iconColor = '#fff'
      e.stopPropagation()
      this.status = true
    }
  }

  // 鼠标移动
  private move (e: TouchEvent | MouseEvent) {
    let x
    if (this.status && !this.isEnd) {
      if (e instanceof TouchEvent) { // 兼容PC端
        x = e.touches[0].pageX
      } else {
        x = e.clientX
      }
      var barAreaLeft = this.barArea.getBoundingClientRect().left
      var moveBlockLeft = x - barAreaLeft // 小方块相对于父元素的left值
      if (moveBlockLeft >= (this.barArea.offsetWidth - (this.blockSize.width as number) / 2 - 2)) {
        moveBlockLeft = this.barArea.offsetWidth - (this.blockSize.width as number) / 2 - 2
      }
      if (moveBlockLeft <= 0) {
        moveBlockLeft = this.blockSize.width as number
      }
      // 拖动后小方块的left值
      this.moveBlockLeft = (moveBlockLeft - this.startLeft)
      this.leftBarWidth = (moveBlockLeft - this.startLeft)
      console.log(this.moveBlockLeft, this.leftBarWidth)
    }
  }

  // 鼠标松开
  private end () {
    this.endMovetime = +new Date()
    // 判断是否重合
    if (this.status && !this.isEnd) {
      var moveLeftDistance = this.moveBlockLeft
      moveLeftDistance = moveLeftDistance * 310 / parseInt((this.setSize.imgWidth as string))
      const data: CheckParamsType = {
        captchaType: 'blockPuzzle',
        pointJson: this.secretKey ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), this.secretKey) : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        token: this.backToken
      }
      this.captchaVerifyData = {
        secretKey: this.secretKey,
        backToken: this.backToken,
        distance: { x: moveLeftDistance, y: 5.0 }
      }
      this.captchaVerification = this.secretKey ? aesEncrypt(this.backToken + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 }), this.secretKey) : this.backToken + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 })
      this.actionEnd(data)
      this.status = false
    }
  }

  @Emit('actionEnd')
  private actionEnd (params: CheckParamsType) {
    console.log(params)
    return params
  }

  private refreshHandler () {
    this.showRefresh = true
    this.finishText = ''

    this.transitionLeft = 'left .3s'
    this.moveBlockLeft = 0

    this.leftBarWidth = 0
    this.transitionWidth = 'width .3s'

    this.leftBarBorderColor = '#ddd'
    this.moveBlockBackgroundColor = '#fff'
    this.iconColor = '#000'
    this.iconClass = 'icon-right'
    this.isEnd = false
    this.refresh()
    setTimeout(() => {
      this.transitionWidth = ''
      this.captchaVerification = ''
      this.transitionLeft = ''
      this.text = this.explain
    }, 300)
  }

  mounted () {
    // 禁止拖拽
    this.$el.addEventListener('selectstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }, false)
    console.log(this.defaultImg)
  }
}
</script>
