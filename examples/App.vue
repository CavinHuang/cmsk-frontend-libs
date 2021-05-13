<template>
  <div class="login-bg">
    <div class="login-bg_pattern">
      <div class="login-bg_left-top-circle">
      </div>
      <div class="login-bg_left100-top-circle">
      </div>
      <div class="login-bg_right-top-circle">
      </div>
      <div class="login-bg_right-bottom-circle">
      </div>
      <div class="login-bg_left-bottom-circle">
      </div>
    </div>

    <Verify
      v-model="verifyVisible"
      :imageInfo="imageInfo"
      :imgSize="{width: '90%', height: 140}"
      :checkTips="checkTips"
      :check-status="checkStatus"
      :refresh="getPictrue"
      @success="successHandle"
      @actionEnd="handleActionEnd"
      @checkStatusChange="checkStatusChange"
      ref="verify"
    ></Verify>

    <div class="login-login_wrap">
      <div class="login-login_box">
        <el-row type="flex" justify="center">
          <el-col :xs="22" :sm="20" :md="20" :lg="20" :xl="14">
            <div class="grid-content">
              <!--登录-->
              <div class="key">
                <div class="bottom-img"></div>
                <div class="form-info mt14vh pb50" style="margin-left:5vw">
                  <el-row :gutter="20">
                    <el-col :xs="22" :sm="14" :md="10" :lg="8" :xl="7">
                      <div class="logo"><img src="../src/assets/logo.png" alt=""></div>
                      <form onsubmit="return false">
                        <ul class="user-info mt60">
                          <li class="user-input">
                            <input class="effect" placeholder="请输入用户名" id="usernameIput" type="text" v-model.trim="loginName" required autocomplete='username' />
                            <label>用户名</label>
                          </li>
                          <li class="user-input">
                            <input class="effect" placeholder="请输入密码" id="passwordIput" type="password" v-model.trim="loginPassword" required autocomplete='current-password' />
                            <label>密码</label>
                          </li>
                          <li class="keep-password">
                            <label>
                              测试账号: admin  &nbsp; &nbsp; 密码: 123456
                            </label>

                          </li>
                          <li class="keep-password">
                            <label>
                              <a href='https://gitee.com/anji-plus/captcha/' target="_blank" style="color:#222"><img src="https://gitee.com/static/images/logo-en.svg" style="vertical-align:middle;margin-right:5px" width="24px"/> gitee</a>
                            </label>

                            <label class="ml20">
                              <a href='https://gitee.com/anji-plus/captcha/stargazers' target="_blank"><img src='https://gitee.com/anji-plus/captcha/badge/star.svg?theme=gvp' style="vertical-align:middle;" alt='star' /></a>
                            </label>

                          </li>
                          <li class="keep-password">
                            <label>
                              <a href='https://github.com/anji-plus/captcha' target="_blank" style="color:#222">
                                <img src="https://github.githubassets.com/favicons/favicon.png"
                                     style="vertical-align:middle;margin-right:5px" width="24px"/> github</a>
                            </label>
                            <label class="ml20">
                              <a href='https://github.com/anji-plus/captcha/stargazers' target="_blank">
                                <img src='https://img.shields.io/github/stars/anji-plus/captcha?style=social'
                                     style="vertical-align:middle;" alt='star' /></a>
                            </label>
                          </li>
                          <li class="mt50">

                            <el-button class="buttonSize button-solid goHome" type="primary" @click="checkPrama">
                              登&nbsp;&nbsp;录</el-button>
                          </li>
                        </ul>

                      </form>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Verify from '../src/components/captcha/SlideCaptcha.vue'
import { CheckStatusType, CheckParamsType, ImageInfoType } from '@/@types/component'
const reqGet = (data: any) => Promise.resolve()
const reqCheck = (data: any) => Promise.resolve()
@Component({
  components: {
    Verify
  }
})
export default class extends Vue {
  private loginName = 'admin'
  private loginPassword = '123456'
  private menu: Array<any> = []
  private checked = true
  private explain = ''
  private checkTips = ''
  private checkStatus: CheckStatusType = 'waiting'
  private dialogFormVisible = false
  private verifyVisible = false
  private imageInfo: ImageInfoType = {
    backImgBase: '',
    blockBackImgBase: '',
    backToken: '',
    secretKey: ''
  }

  created () {
    this.uuid()
    this.getPictrue()
  }

  successHandle (result: any) {
    console.log('验证成功', result)
  }

  // 生成 uuid
  uuid () {
    const s: Array<number | any> = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
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

  // 请求背景图片和验证图片
  getPictrue () {
    const data = {
      captchaType: 'blockPuzzle', // clickWord
      clientUid: localStorage.getItem('slider'),
      ts: Date.now() // 现在的时间戳
    }
    reqGet(data).then((res: any) => {
      if (res.repCode === '0000') {
        this.imageInfo.backImgBase = res.repData.originalImageBase64
        this.imageInfo.blockBackImgBase = res.repData.jigsawImageBase64
        this.imageInfo.backToken = res.repData.token
        this.imageInfo.secretKey = res.repData.secretKey
        // 点击字验证码特有，滑动不需要
        this.imageInfo.wordList = res.repData.wordList
      } else {
        this.checkTips = res.repMsg
      }

      // 判断接口请求次数是否失效
      if (res.repCode === '6201') {
        this.imageInfo.backImgBase = ''
        this.imageInfo.blockBackImgBase = ''
      }
    })
  }

  handleActionEnd (data: CheckParamsType) {
    reqCheck(data).then((res: any) => {
      if (res.repCode === '0000') {
        this.checkStatus = 'success'
      } else {
        this.checkStatus = 'error'
        this.checkTips = res.reqMsg
      }
    })
  }

  checkStatusChange (status: CheckStatusType) {
    this.checkStatus = status
  }

  checkPrama () {
    if (!this.loginName || !this.loginPassword) {
      this.$message({
        message: '请输入完整的用户名密码',
        type: 'error'
      })
      return false
    }
    this.verifyVisible = true
  }

  login () {
    if (this.loginName === 'admin' && this.loginPassword === '123456') {
    } else {
      this.$message({
        message: '输入测试账号密码',
        type: 'warning'
      })
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../src/assets/style/theme";
  $wathet-blue: #f0f7ff;
  $wathet-blue: #f0f7ff;
  $color91: #919191;
  $coloreE0: #e0e0e0;
  $colore666: #666;
  :focus {
    outline: none;
  }
  .login-bg {
    background: $wathet-blue;
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .login-bg_pattern {
    position: absolute;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    .login-bg_left-top-circle,
    .login-bg_left100-top-circle,
    .login-bg_right-top-circle,
    .login-bg_right-bottom-circle,
    .login-bg_left-bottom-circle {
      opacity: 0.45;
      background: #e1eeff;
      border-radius: 74px;
      display: block;
      float: left;
      position: relative;
    }
    .login-bg_left-top-circle {
      width: 300px;
      height: 300px;
      transform: rotate(30deg);
      margin-top: -150px;
      margin-left: 70px;
    }
    .login-bg_left100-top-circle {
      width: 200px;
      height: 200px;
      transform: rotate(30deg);
      margin-top: -150px;
      margin-left: 200px;
    }
    .login-bg_right-top-circle {
      width: 300px;
      height: 400px;
      margin-right: -100px;
      transform: rotate(42deg);
      float: right;
    }
    .login-bg_right-bottom-circle {
      width: 300px;
      height: 300px;
      transform: rotate(30deg);
      bottom: -200px;
      right: 350px;
      position: absolute;
    }
    .login-bg_left-bottom-circle {
      width: 300px;
      height: 300px;
      transform: rotate(-11deg);
      bottom: -50px;
      left: -100px;
      position: absolute;
    }
  }
  .login-login_box {
    position: absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    z-index: 1000;
    width: 100%;
    /*overflow: auto;*/
    .key {
      box-sizing: border-box;
      background: $white url("../src/assets/bg-1.png") right top no-repeat;
      box-shadow: 0 0 60px 5px rgba(36, 132, 255, 0.41);
      border-radius: 8px;
      overflow: hidden;
      opacity: 0;
      -webkit-animation: fromBack 0.3s linear 0.1s forwards;
      -moz-animation: fromBack 0.3s linear 0.1s forwards;
      -ms-animation: fromBack 0.3s linear 0.1s forwards;
      animation: fromBack 0.3s linear 0.1s forwards;
      /* -webkit- */
      @-webkit-keyframes fromBack {
        0% {
          -webkit-transform: scale(0);
          opacity: 0;
        }
        100% {
          -webkit-transform: scale(1);
          opacity: 1;
          min-height: 69vh;
          max-height: 90vh;
        }
      }
      /* -moz- */
      @-moz-keyframes fromBack {
        0% {
          -moz-transform: scale(0);
          opacity: 0;
        }
        100% {
          -moz-transform: scale(1);
          opacity: 1;
          height: 69vh;
          min-height: 69vh;
          max-height: 90vh;
        }
      }
      /**/
      @keyframes fromBack {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
          min-height: 69vh;
          max-height: 90vh;
        }
      }
      .bottom-img {
        width: 170px;
        height: 170px;
        display: block;
        position: absolute;
        z-index: 2;
        bottom: 0;
        background: url("/static/login/bg-2.png") left bottom no-repeat;
      }
      .form-info {
        .logo img{
          width: 200px;
          height: 89px;
          display: block;
          margin: 0 auto;
        }
        .user-info {
          padding-left: $px30;
          .user-input {
            position: relative;
            border-bottom: 1px solid $coloreE0;
            padding: 0 20px 0 30px;
            margin-top: 37px;
            height: 30px;
            background: #fff;
            .effect ~ label {
              position: relative;
              top: -45px;
              width: 100%;
              color: $color91;
              transition: 0.3s;
              -webkit-transition: 0.1s;
              font-size: $f12;
              letter-spacing: 0.5px;
            }
            .effect:focus ~ label {
              position: relative;
              top: -45px;
              color: $lightblue;
              transition: 0.3s;
              border-left: 3px solid $lightblue;
              margin-left: -30px;
              padding-left: 30px;
            }
            input {
              position: relative;
              width: 100%;
              font-size: 13px;
            }
          }
          .keep-password {
            font-size: $f13;
            letter-spacing: 0;
            margin-top: $px24;
            label {
              .el-checkbox__input.is-checked + .el-checkbox__label {
                color: $color91;
              }
            }
          }
          .goHome {
            background: $lightblue;
            box-shadow: 0 12px 51px -12px $azure;
            border-radius: 100px;
            width: 140px;
            height: 40px;
            display: block;
            margin: $px24 auto;
            font-size: $f18;
            text-align: center;
            line-height: 17px;
          }
          .register {
            font-size: 13px;
            color: #919191;
            text-align: center;
            .a {
              color: $lightblue;
              cursor: pointer;
            }
            .a:hover {
              text-decoration: underline;
            }
          }
          .forget {
            font-size: $f13;
            color: $lightblue;
            letter-spacing: 0;
            text-align: right;
            border: none;
            padding: 0;
            text-decoration: underline;
            background: none;
            margin-top: 2px;
          }
        }
      }
    }
  }
  /*注册*/
  .transition-box {
    position: relative;
    margin-top: 0;
    z-index: 1000;
    background-color: $white;
  }
  .qrcode {
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  #qrcode {
    width: 120px;
    padding: 20px;
    margin: 40px auto;
    display: block;
  }
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }
</style>
