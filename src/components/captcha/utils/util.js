const getNumFromStr = (str) => {
  const res = str.match(/\d+/)
  return res ? Number(res[0]) : 0
}
export function resetSize (vm, imgSize, barSize) {
  let img_width, img_height, bar_width, bar_height // 图片的宽度、高度，移动条的宽度、高度
  const parentWidth = document.body.offsetWidth
  const parentHeight = document.body.offsetHeight
  if (vm.imgSize.width.toString().indexOf('%') !== -1) {
    img_width = (getNumFromStr(imgSize.width)) / 100 * parentWidth - 30
  } else {
    img_width = imgSize.width
  }
  if (vm.imgSize.height.toString().indexOf('%') !== -1) {
    img_height = (getNumFromStr(imgSize.height)) / 100 * parentHeight - 30
  } else {
    img_height = imgSize.height
  }
  if (vm.barSize.width.toString().indexOf('%') !== -1) {
    bar_width = (getNumFromStr(barSize.width)) / 100 * parentWidth - 30
  } else {
    bar_width = barSize.width
  }
  if (vm.barSize.height.toString().indexOf('%') !== -1) {
    bar_height = (getNumFromStr(barSize.height)) / 100 * parentHeight - 30
  } else {
    bar_height = barSize.height
  }
  return { imgWidth: img_width, imgHeight: img_height, barWidth: bar_width, barHeight: bar_height }
}
export const _code_chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const _code_color1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']
export const _code_color2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']
// # sourceMappingURL=util.js.map
