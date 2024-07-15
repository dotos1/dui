import { ɵRandomHelper } from './random.helper';

export abstract class ɵIdGenerator {
    public static generate(name: string = ''): string {
        const randomId = ɵRandomHelper.getRandomInt(1, 1000000);
        const nameAsPrefix = (name) ? `${name}-` : '';

        return `${nameAsPrefix}${randomId}`;
    }
}
