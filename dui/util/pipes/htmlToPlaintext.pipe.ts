import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'htmlToPlaintext' })
export class HtmlToPlaintextPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: string, args: any[] = []): string {
        return value ? String(value).replace(/<[^>]+>/gm, '') : '';
    }
}
