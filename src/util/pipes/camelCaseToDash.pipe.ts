import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'camelCaseToDash' })
export class CamelCaseToDashPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: string, args: any[] = []): string {
        return value ? String(value).replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) : '';
    }
}
