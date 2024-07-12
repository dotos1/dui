const unitsRegExp: RegExp = /(\d|\.|-)+/g;

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

function round(raw: number): string {
    const value: string = parseFloat(Number(raw).toFixed(5)).toString();
    if (value.length > 1 && value[0] === '0') {
        return value.substring(1);
    } else if (value.length > 2 && value[0] === '-' && value[1] === '0') {
        return `-${value.substring(2)}`;
    }
    return value;
}
