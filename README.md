# cmsk-fontend-libs
> 城科前端组件管理仓库

## 使用

```bash
npm i cmsk-fontend-libs // or yarn add cmsk-fontend-libs
```

## 组件介绍
### 拖拽图形验证码 (SliderCaptcha) 和 文字点击确认验证码(ClickWordCaptcha)
```js
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
```

#### 接入方式，可参考 examples/App.vue
 - 需要生成客户端uuid，用于服务端通信
 - 获取图片验证码相关的信息，此处自己完成接口
 - 根据组件响应的不同事件完成相关的动作
 ```js
  actionEnd // 拖拽验证码 此为松开鼠标时的事件  点击文字验证此为点击数等于默认数时的事件 此时会响应对应的信息，需要调用校验接口进行数据校验，校验成功需要改变组件的检验状态 checkStatus 此处有三种状态 'waiting', 'success', 'error'

  success // 成功后的回调
  checkStatusChange // 响应校验状态的改变并保存
 ```

### 参数
```js
// SliderCaptcha
  // 验证码出现类型 pop=>弹窗 fixed=>悬浮
  public mode: CaptchaPositionType
  // 验证码当前校验状态
  public checkStatus: CheckStatusType
  // 距离顶部或者底部的距离
  public vSpace: number
  // 滑块说明文字
  public explain: string
  // 验证提示文字
  public checkTips: string
  // 重新刷新的方法
  public refresh: () => void
  // 图片大小
  public imgSize: ImageSizeType
  // 图片信息
  public imageInfo: ImageInfoType
  // 滑块大小
  public blockSize: ImageSizeType
  // 滑道大小
  public barSize: ImageSizeType


// ClickWordCaptcha
    // 验证码出现类型 pop=>弹窗 fixed=>悬浮
    public mode: CaptchaPositionType
    // 验证码当前校验状态
    public checkStatus: CheckStatusType
    // 距离顶部或者底部的距离
    public vSpace: number
    // 滑块说明文字
    public explain: string
    // 重新刷新的方法
    public refresh: () => void
    // 图片大小
    public imgSize: ImageSizeType
    // 图片信息
    public imageInfo: ImageInfoType
    // 滑道大小
    public barSize: ImageSizeType
```
