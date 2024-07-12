
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatSpace'
})
export class FormatSpacePipe implements PipeTransform {

    transform(inputValue: string, replaceChar: string = '_', lowerCase: boolean = true): string {
        let transformedString = '';
        if (inputValue) {
            transformedString = lowerCase ? inputValue.trim().split(' ').join(replaceChar).toLocaleLowerCase() :
                inputValue.trim().split(' ').join(replaceChar);
        }
        return transformedString;
    }

}
