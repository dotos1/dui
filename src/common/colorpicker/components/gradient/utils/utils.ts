/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/utils/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/utils/utils.ts`，提供工具集相关的定义与实现。
 */

import { formatInputValues } from './formatters';
import { ColorsProps } from '../shared/types';
import { config } from '../constants';

/**
 * Constant/variable `{ barSize, crossSize }` defining { bar size, cross size } in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `{ barSize, crossSize }`，定义 `src/common/colorpicker/components/gradient/utils` 中的{条Size,cross尺寸}。
 */
const { barSize, crossSize } = config

/**
 * Constant/variable `safeBounds` defining safe bounds in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `safeBounds`，定义 `src/common/colorpicker/components/gradient/utils` 中的安全边界框。
 */
export const safeBounds = (e) => {
  const client = e.target.parentNode.getBoundingClientRect()
  const className = e.target.className
  const adjuster = className === 'c-resize ps-rl' ? 15 : 0
  return {
    offsetLeft: client?.x + adjuster,
    offsetTop: client?.y,
    clientWidth: client?.width,
    clientHeight: client?.height,
  }
}

/**
 * Executes `getHandleValue` to handle get handle value.
 * @zh 执行 `getHandleValue`，用于获取连接手柄值。
 * @param e - e parameter (`any`) / e参数（`any`）
 */
export function getHandleValue(e) {
  const { offsetLeft, clientWidth } = safeBounds(e)
  const pos = e.clientX - offsetLeft - barSize / 2
  const adjuster = clientWidth - 18
  const bounded = formatInputValues(pos, 0, adjuster)
  return Math.round(bounded / (adjuster / 100))
}

/**
 * Executes `computeSquareXY` to handle compute square xy.
 * @zh 执行 `computeSquareXY`，用于计算SquareXY坐标。
 * @param s - s parameter (`number`) / s参数（`number`）
 * @param v - v parameter (`number`) / v参数（`number`）
 * @param squareWidth - square width parameter (`number`) / square宽度参数（`number`）
 * @param squareHeight - square height parameter (`number`) / square高度参数（`number`）
 */
export function computeSquareXY(
  s: number,
  v: number,
  squareWidth: number,
  squareHeight: number
) {
  const x = s * squareWidth - crossSize / 2
  const y = ((100 - v) / 100) * squareHeight - crossSize / 2
  return [x, y]
}

/**
 * Constant/variable `getClientXY` defining get client xy in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `getClientXY`，定义 `src/common/colorpicker/components/gradient/utils` 中的获取ClientXY坐标。
 */
const getClientXY = (e: { clientX?; clientY?; touches? }) => {
  if (e.clientX) {
    return { clientX: e.clientX, clientY: e.clientY }
  } else {
    const touch = e.touches[0] || {}
    return { clientX: touch.clientX, clientY: touch.clientY }
  }
}

/**
 * Executes `computePickerPosition` to handle compute picker position.
 * @zh 执行 `computePickerPosition`，用于计算选择器位置。
 * @param e - e parameter (`any`) / e参数（`any`）
 */
export function computePickerPosition(e) {
  const { offsetLeft, offsetTop, clientWidth, clientHeight } = safeBounds(e)
  const { clientX, clientY } = getClientXY(e)

  const getX = () => {
    const xPos = clientX - offsetLeft - crossSize / 2
    return formatInputValues(xPos, -9, clientWidth - 10)
  }
  const getY = () => {
    const yPos = clientY - offsetTop - crossSize / 2
    return formatInputValues(yPos, -9, clientHeight - 10)
  }

  return [getX(), getY()]
}

/**
 * Constant/variable `getGradientType` defining get gradient type in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `getGradientType`，定义 `src/common/colorpicker/components/gradient/utils` 中的获取渐变类型。
 */
export const getGradientType = (value: string) => {
  return value?.split('(')[0]
}

/**
 * Constant/variable `isUpperCase` defining is upper case in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `isUpperCase`，定义 `src/common/colorpicker/components/gradient/utils` 中的是否为上限Case。
 */
export const isUpperCase = (str: string) => {
  return str?.[0] === str?.[0]?.toUpperCase()
}

/**
 * Constant/variable `compareGradients` defining compare gradients in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `compareGradients`，定义 `src/common/colorpicker/components/gradient/utils` 中的比较渐变。
 */
export const compareGradients = (g1: string, g2: string) => {
  const ng1 = g1?.toLowerCase()?.replaceAll(' ', '')
  const ng2 = g2?.toLowerCase()?.replaceAll(' ', '')
  if (ng1 === ng2) {
    return true
  } else {
    return false
  }
}

/**
 * Constant/variable `convertShortHandDeg` defining convert short hand deg in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `convertShortHandDeg`，定义 `src/common/colorpicker/components/gradient/utils` 中的转换ShortHandDeg。
 */
const convertShortHandDeg = (dir) => {
  if (dir === 'to top') {
    return 0
  } else if (dir === 'to bottom') {
    return 180
  } else if (dir === 'to left') {
    return 270
  } else if (dir === 'to right') {
    return 90
  } else if (dir === 'to top right') {
    return 45
  } else if (dir === 'to bottom right') {
    return 135
  } else if (dir === 'to bottom left') {
    return 225
  } else if (dir === 'to top left') {
    return 315
  } else {
    const safeDir = dir || 0
    return parseInt(safeDir)
  }
}

/**
 * Constant/variable `objectToString` defining object to string in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `objectToString`，定义 `src/common/colorpicker/components/gradient/utils` 中的对象转换为字符串。
 */
export const objectToString = (value) => {
  if (typeof value === 'string') {
    return value
  } else {
    if (value?.type?.includes('gradient')) {
      const sorted = value?.colorStops?.sort(
        (a: { left? }, b: { left? }) => a?.left - b?.left
      )
      const string = sorted
        ?.map((c: { value?; left? }) => `${c?.value} ${c?.left}%`)
        ?.join(', ')
      const type = value?.type
      const degs = convertShortHandDeg(value?.orientation?.value)
      const gradientStr = type === 'linear-gradient' ? `${degs}deg` : 'circle'
      return `${type}(${gradientStr}, ${string})`
    } else {
      const color = value?.colorStops[0]?.value || 'rgba(175, 51, 242, 1)'
      return color
    }
  }
}

/**
 * Constant/variable `getColorObj` defining get color obj in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `getColorObj`，定义 `src/common/colorpicker/components/gradient/utils` 中的获取颜色对象。
 */
export const getColorObj = (colors: ColorsProps[]) => {
  const idxCols = colors?.map((c: ColorsProps, i: number) => ({
    ...c,
    index: i,
  }))

  const upperObj = idxCols?.find((c: ColorsProps) => isUpperCase(c.value))
  const ccObj = upperObj || idxCols[0]

  return {
    currentColor: ccObj?.value || config?.defaultGradient,
    selectedColor: ccObj?.index || 0,
    currentLeft: ccObj?.left || 0,
  }
}

/**
 * Constant/variable `getDegrees` defining get degrees in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `getDegrees`，定义 `src/common/colorpicker/components/gradient/utils` 中的获取度数。
 */
const getDegrees = (value: string) => {
  const s1 = value?.split(',')[0]
  const s2 = s1?.split('(')[1]?.replace('deg', '')
  return convertShortHandDeg(s2)
}

/**
 * Constant/variable `getDetails` defining get details in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `getDetails`，定义 `src/common/colorpicker/components/gradient/utils` 中的获取详情列表。
 */
export const getDetails = (value: string) => {
  const isGradient = value?.includes('gradient')
  const gradientType = value?.split('(')[0]
  const degrees = getDegrees(value)
  const degreeStr =
    gradientType === 'linear-gradient' ? `${degrees}deg` : 'circle'

  return {
    degrees,
    degreeStr,
    isGradient,
    gradientType,
  }
}
