

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'multiValue' })
export class MultiValuePipe implements PipeTransform {

    static DEFAULT_SEPARATOR = ', ';

    transform(values: string | string [], valueSeparator: string = MultiValuePipe.DEFAULT_SEPARATOR): string {

        if (values && values instanceof Array) {
            const valueList = values.map((value) => value.trim());
            return valueList.join(valueSeparator);
        }

        return <string> values;
    }
}
