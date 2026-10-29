/**
 * @fileoverview Module `src/theme/utils/rules-operations.ts` providing rules operations definitions and implementation.
 * @zh 模块文件 `src/theme/utils/rules-operations.ts`，提供规则列表operations相关的定义与实现。
 */

/**
 * Constant/variable `unitsRegExp` defining units reg exp in `src/theme/utils`.
 * @zh 常量/变量 `unitsRegExp`，定义 `src/theme/utils` 中的unitsRegExp。
 */
const unitsRegExp: RegExp = /(\d|\.|-)+/g;

/**
 * Executes `multiplyRule` to handle multiply rule.
 * @zh 执行 `multiplyRule`，用于multiply规则。
 * @param rule - rule parameter (`string | number`) / 规则参数（`string | number`）
 * @param multiplier - multiplier parameter (`number`) / multiplier参数（`number`）
 * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
 */
export function multiplyRule(rule: number | string, multiplier: number): number | string {
    if (typeof rule === 'string') {
        const value: number = parseFloat(rule);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return (value * multiplier) + units;
        }
        return rule;
    }
    return (rule as number) * multiplier;
}

/**
 * Executes `divideRule` to handle divide rule.
 * @zh 执行 `divideRule`，用于divide规则。
 * @param rule - rule parameter (`string | number`) / 规则参数（`string | number`）
 * @param divide - divide parameter (`number`) / divide参数（`number`）
 * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
 */
export function divideRule(rule: number | string, divide: number): number | string {
    if (typeof rule === 'string') {
        const value: number = parseFloat(rule);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return (value / divide) + units;
        }
        return rule;
    }
    return (rule as number) / divide;
}

/**
 * Executes `addRule` to handle add rule.
 * @zh 执行 `addRule`，用于添加规则。
 * @param rule - rule parameter (`string | number`) / 规则参数（`string | number`）
 * @param add - add parameter (`string | number`) / 添加参数（`string | number`）
 * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
 */
export function addRule(rule: number | string, add: number | string): number | string {
    if (typeof rule === 'string' && typeof add === 'string') {
        const value: number = parseFloat(rule);
        const addNumber: number = parseFloat(add);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return (value + addNumber) + units;
        }
        return rule;
    } else if (typeof rule === 'string' && typeof add === 'number') {
        const value: number = parseFloat(rule);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return (value + add) + units;
        }
        return rule;
    } else if (typeof rule === 'number' && typeof add === 'string') {
        const addNumber: number = parseFloat(add);
        if (!isNaN(addNumber)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return ((rule as number) + addNumber) + units;
        }
        return rule;
    }
    return (rule as number) + (add as number);
}

/**
 * Executes `subtractRule` to handle subtract rule.
 * @zh 执行 `subtractRule`，用于subtract规则。
 * @param rule - rule parameter (`string | number`) / 规则参数（`string | number`）
 * @param subtract - subtract parameter (`string | number`) / subtract参数（`string | number`）
 * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
 */
export function subtractRule(rule: number | string, subtract: number | string): number | string {
    if (typeof rule === 'string' && typeof subtract === 'string') {
        const value: number = parseFloat(rule);
        const subtractNumber: number = parseFloat(subtract);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return (value - subtractNumber) + units;
        }

        return rule;
    } else if (typeof rule === 'string' && typeof subtract === 'number') {
        const value: number = parseFloat(rule);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return (value - subtract) + units;
        }
        return rule;
    } else if (typeof rule === 'number' && typeof subtract === 'string') {
        const subtractNumber: number = parseFloat(subtract);
        if (!isNaN(subtractNumber)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return ((rule as number) - subtractNumber) + units;
        }
        return rule;
    }

    return (rule as number) - (subtract as number) ;
}

/**
 * Executes `roundRule` to handle round rule.
 * @zh 执行 `roundRule`，用于四舍五入规则。
 * @param rule - rule parameter (`string | number`) / 规则参数（`string | number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function roundRule(rule: number | string): string {
    if (typeof rule === 'string') {
        const value: number = parseFloat(rule);
        if (!isNaN(value)) {
            const units: string = rule.toString().replace(unitsRegExp, '');
            return round(value) + units;
        }

        return rule;
    }

    return round(rule as number);
}

/**
 * Executes `round` to handle round.
 * @zh 执行 `round`，用于四舍五入。
 * @param raw - raw parameter (`number`) / 原始参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function round(raw: number): string {
    const value: string = parseFloat(Number(raw).toFixed(5)).toString();
    if (value.length > 1 && value[0] === '0') {
        return value.substring(1);
    } else if (value.length > 2 && value[0] === '-' && value[1] === '0') {
        return `-${value.substring(2)}`;
    }
    return value;
}
