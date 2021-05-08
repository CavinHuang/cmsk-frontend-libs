import { CaptchaPositionType, CheckStatusType, ImageInfoType, ImageSizeType } from '@/@types/component'
import { BaseComponent } from '@/@types/sfc'

export declare class ClickWordCaptchaConstruct extends BaseComponent {
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
}
