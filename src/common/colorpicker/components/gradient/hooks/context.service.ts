/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/hooks/context.service.ts` providing context service definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/hooks/context.service.ts`，提供上下文服务相关的定义与实现。
 */

import { isUpperCase, getColorObj, getDetails } from '../utils/utils';
import { low, high, getColors } from '../utils/formatters';
import { GradientProps } from '../shared/types';
import tinycolor from 'tinycolor2';
import { Injectable } from '@angular/core';

// const PickerContext = createContext<PickerContextProps | null>(null)

/**
 * Type alias `PCWProps` representing pcw props (`{ classes: any; value: string; squareWidth: number; children: any; squ...`).
 * @zh 类型别名 `PCWProps`，表示PCW属性集合（`{ classes: any; value: string; squareWidth: number; children: any; squ...`）。
 */
type PCWProps = {
  /**
   * Property `classes` (`any`) storing classes.
   * @zh 属性 `classes`（类型：`any`），用于存储或配置类名集合。
   */
  classes;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
  /**
   * Property `squareWidth` (`number`) storing square width.
   * @zh 属性 `squareWidth`（类型：`number`），用于存储或配置square宽度。
   */
  squareWidth: number;
  /**
   * Property `children` (`any`) storing children.
   * @zh 属性 `children`（类型：`any`），用于存储或配置子级列表。
   */
  children;
  /**
   * Property `squareHeight` (`number`) storing square height.
   * @zh 属性 `squareHeight`（类型：`number`），用于存储或配置square高度。
   */
  squareHeight: number;
  /**
   * Property `hideOpacity` (`boolean`) storing hide opacity.
   * @zh 属性 `hideOpacity`（类型：`boolean`），用于存储或配置隐藏不透明度。
   */
  hideOpacity: boolean;
  /**
   * Property `onChange` (`(arg0: string) => void`) storing on change.
   * @zh 属性 `onChange`（类型：`(arg0: string) => void`），用于存储或配置当变更。
   */
  onChange: (arg0: string) => void;
};

/**
 * Type alias `PickerContextProps` representing picker context props (`{ hc: any; classes: any; value: string; colors: GradientProps[]; degre...`).
 * @zh 类型别名 `PickerContextProps`，表示选择器上下文属性集合（`{ hc: any; classes: any; value: string; colors: GradientProps[]; degre...`）。
 */
export type PickerContextProps = {
  /**
   * Property `hc` (`any`) storing hc.
   * @zh 属性 `hc`（类型：`any`），用于存储或配置hc。
   */
  hc;
  /**
   * Property `classes` (`any`) storing classes.
   * @zh 属性 `classes`（类型：`any`），用于存储或配置类名集合。
   */
  classes;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
  /**
   * Property `colors` (`GradientProps[]`) storing colors.
   * @zh 属性 `colors`（类型：`GradientProps[]`），用于存储或配置颜色列表。
   */
  colors: GradientProps[];
  /**
   * Property `degrees` (`number`) storing degrees.
   * @zh 属性 `degrees`（类型：`number`），用于存储或配置度数。
   */
  degrees: number;
  /**
   * Property `onChange` (`(arg0: string) => void`) storing on change.
   * @zh 属性 `onChange`（类型：`(arg0: string) => void`），用于存储或配置当变更。
   */
  onChange: (arg0: string) => void;
  /**
   * Property `inputType` (`string`) storing input type.
   * @zh 属性 `inputType`（类型：`string`），用于存储或配置输入属性类型。
   */
  inputType: string;
  /**
   * Property `tinyColor` (`any`) storing tiny color.
   * @zh 属性 `tinyColor`（类型：`any`），用于存储或配置tiny颜色。
   */
  tinyColor;
  /**
   * Property `isGradient` (`boolean`) storing is gradient.
   * @zh 属性 `isGradient`（类型：`boolean`），用于存储或配置是否为渐变。
   */
  isGradient: boolean;
  /**
   * Property `squareWidth` (`number`) storing square width.
   * @zh 属性 `squareWidth`（类型：`number`），用于存储或配置square宽度。
   */
  squareWidth: number;
  /**
   * Property `hideOpacity` (`boolean`) storing hide opacity.
   * @zh 属性 `hideOpacity`（类型：`boolean`），用于存储或配置隐藏不透明度。
   */
  hideOpacity: boolean;
  /**
   * Property `currentLeft` (`number`) storing current left.
   * @zh 属性 `currentLeft`（类型：`number`），用于存储或配置当前左侧位置。
   */
  currentLeft: number;
  /**
   * Property `deletePoint` (`() => void`) storing delete point.
   * @zh 属性 `deletePoint`（类型：`() => void`），用于存储或配置删除坐标点。
   */
  deletePoint: () => void;
  /**
   * Property `squareHeight` (`number`) storing square height.
   * @zh 属性 `squareHeight`（类型：`number`），用于存储或配置square高度。
   */
  squareHeight: number;
  /**
   * Property `setInputType` (`(arg0: string) => void`) storing set input type.
   * @zh 属性 `setInputType`（类型：`(arg0: string) => void`），用于存储或配置集合输入属性类型。
   */
  setInputType: (arg0: string) => void;
  /**
   * Property `gradientType` (`string`) storing gradient type.
   * @zh 属性 `gradientType`（类型：`string`），用于存储或配置渐变类型。
   */
  gradientType?: string;
  /**
   * Property `handleChange` (`(arg0: string) => void`) storing handle change.
   * @zh 属性 `handleChange`（类型：`(arg0: string) => void`），用于存储或配置连接手柄变更。
   */
  handleChange: (arg0: string) => void;
  /**
   * Property `currentColor` (`string`) storing current color.
   * @zh 属性 `currentColor`（类型：`string`），用于存储或配置当前颜色。
   */
  currentColor: string;
  /**
   * Property `selectedColor` (`number`) storing selected color.
   * @zh 属性 `selectedColor`（类型：`number`），用于存储或配置已选中颜色。
   */
  selectedColor: number;
  /**
   * Property `setHc` (`(arg0: any) => void`) storing set hc.
   * @zh 属性 `setHc`（类型：`(arg0: any) => void`），用于存储或配置集合Hc。
   */
  setHc: (arg0) => void;
  /**
   * Property `handleGradient` (`(arg0: string, arg1?: number) => void`) storing handle gradient.
   * @zh 属性 `handleGradient`（类型：`(arg0: string, arg1?: number) => void`），用于存储或配置连接手柄渐变。
   */
  handleGradient: (arg0: string, arg1?: number) => void;
  /**
   * Property `createGradientStr` (`(arg0: GradientProps[]) => void`) storing create gradient str.
   * @zh 属性 `createGradientStr`（类型：`(arg0: GradientProps[]) => void`），用于存储或配置创建渐变字符串。
   */
  createGradientStr: (arg0: GradientProps[]) => void;
  /**
   * Property `previous` (`{ color?: string; gradient?: string; }`) storing previous.
   * @zh 属性 `previous`（类型：`{ color?: string; gradient?: string; }`），用于存储或配置上一个。
   */
  previous: {
    color?: string;
    gradient?: string;
  };
};

/**
 * Injectable Angular service `ContextService` managing context service state and operations in `src/common/colorpicker/components/gradient/hooks`.
 * @zh 可注入的 Angular 服务 `ContextService`，管理 `src/common/colorpicker/components/gradient/hooks` 中的上下文服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  /**
   * Property `pickerContext` (`PickerContextProps`) storing picker context.
   * @zh 属性 `pickerContext`（类型：`PickerContextProps`），用于存储或配置选择器上下文。
   */
  public pickerContext: PickerContextProps;

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param { value, classes, children, on... - { value, classes, children, on parameter (`PCWProps`) / {value,classes,children,当参数（`PCWProps`）
   */
  public init({
    value,
    classes,
    children,
    onChange,
    squareWidth,
    hideOpacity,
    squareHeight,
  }: PCWProps) {
    const colors = getColors(value);
    const { degrees, degreeStr, isGradient, gradientType } = getDetails(value);
    const { currentColor, selectedColor, currentLeft } = getColorObj(colors);
    const [inputType, setInputType] = useState('rgb');
    const [previous, setPrevious] = useState({});
    const tinyColor = tinycolor(currentColor);
    const rgba = tinyColor.toRgb();
    const hsv = tinyColor.toHsv();
    const [hc, setHc] = useState({ ...rgba, ...hsv });

    // useEffect(() => {
    if (hsv?.s === 0) {
      setHc({ ...rgba, ...hsv, h: hc?.h });
    } else {
      setHc({ ...rgba, ...hsv });
    }
    // }, [currentColor])

    const createGradientStr = (newColors: GradientProps[]) => {
      const sorted = newColors.sort(
        (a: GradientProps, b: GradientProps) => a.left - b.left
      );
      const colorString = sorted?.map((cc: { value?; left? }) => `${cc?.value} ${cc.left}%`);
      const newGrade = `${gradientType}(${degreeStr}, ${colorString.join(
        ', '
      )})`;
      setPrevious({ ...previous, gradient: newGrade });
      onChange(newGrade);
    };


    const handleGradient = (newColor: string, left?: number) => {
      const remaining = colors?.filter(
        (c: GradientProps) => !isUpperCase(c.value)
      );
      const newColors = [
        { value: newColor.toUpperCase(), left: left || currentLeft },
        ...remaining,
      ];
      createGradientStr(newColors);
    };
    
    const handleChange = (newColor: string) => {
      if (isGradient) {
        handleGradient(newColor);
      } else {
        setPrevious({ ...previous, color: newColor });
        onChange(newColor);
      }
    };

    const deletePoint = () => {
      if (colors?.length > 2) {
        const formatted = colors?.map((fc: GradientProps, i: number) => ({
          ...fc,
          value: i === selectedColor - 1 ? high(fc) : low(fc),
        }));
        const remaining = formatted?.filter(
          (_, i: number) => i !== selectedColor
        );
        createGradientStr(remaining);
      }
    };
    this.pickerContext = {
      hc,
      setHc,
      value,
      colors,
      degrees,
      classes,
      onChange,
      previous,
      inputType,
      tinyColor,
      isGradient,
      squareWidth,
      hideOpacity,
      currentLeft,
      deletePoint,
      squareHeight,
      setInputType,
      gradientType,
      handleChange,
      currentColor,
      selectedColor,
      handleGradient,
      createGradientStr,
    };
  }
  /**
   * Executes `getContext` to handle get context.
   * @zh 执行 `getContext`，用于获取上下文。
   */
  getContext() {
    return this.pickerContext;
  }
}

// export default function PickerContextWrapper({
//   value,
//   classes,
//   children,
//   onChange,
//   squareWidth,
//   hideOpacity,
//   squareHeight,
// }: PCWProps) {

//   return (
//     <PickerContext.Provider value={pickerContext}>
//       {children}
//     </PickerContext.Provider>
//   )
// }

// export function usePicker() {
//   const pickerContext = useContext(PickerContext)

//   if (!pickerContext) {
//     throw new Error('usePicker has to be used within <PickerContext.Provider>')
//   }

//   return pickerContext
// }
