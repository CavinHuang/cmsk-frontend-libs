/**
 * 验证码类型
 */
export type CaptchaType = 'blockPuzzle' | 'clickWord'
/**
 * 验证码位置类型
 */
export type CaptchaPositionType = 'pop' | 'fixed'

export type ComponentType = 'VerifySlide' | 'VerifyPoints'
/**
 * 图片大小类型
 */
export interface ImageSizeType {
  width: number | string
  height: number | string
}

/**
 * 设置大小
 */
export interface SetSizeType {
  imgHeight: number | string
  imgWidth: number | string
  barHeight: number | string
  barWidth: number | string
  [key: string]: any
}

/**
 * 图片信息
 */
export interface ImageInfoType {
  backImgBase: string
  blockBackImgBase: string
  backToken: string
  secretKey: string
  wordList?: Array<string>
}

/**
 * 验证码校验参数
 */
export interface CheckParamsType {
  captchaType: CaptchaType
  pointJson: string
  token: string
}

/**
 * 验证码当前校验状态
 */
export type CheckStatusType = 'waiting' | 'success' | 'error'

/**
 * 坐标点
 */
export interface PointType {
  x: number
  y: number
}
