import { Injectable } from '@angular/core';
import { ɵIsNumber } from '../../core';
import { ɵDynamicWindowRefModel } from '../classes';

/** @internal */
@Injectable({
    providedIn: 'root'
})
export class ɵDynamicWindowsDefaultCoordinatesService {
    private readonly base = 96;
    private readonly multiplier = 32;
    private readonly maxAmountOfWindows = 8;
    private currentAmountOfWindows = 0;

    public applyIfSpecificAbsent(windowRef: ɵDynamicWindowRefModel): void {
        if (!ɵIsNumber(windowRef.config.x) || !ɵIsNumber(windowRef.config.y)) {
            this.resetCurrentAmountOfWindowsIfExceedsMax();
            const targetPosition = this.calculate();
            this.currentAmountOfWindows++;
            windowRef.updateConfig({
                x: (windowRef.config.x ?? targetPosition),
                y: (windowRef.config.y ?? targetPosition)
            });
        }
    }

    private resetCurrentAmountOfWindowsIfExceedsMax(): void {
        if (this.currentAmountOfWindows >= this.maxAmountOfWindows) {
            this.currentAmountOfWindows = 0;
        }
    }

    private calculate(): number {
        return (this.base + (this.multiplier * this.currentAmountOfWindows));
    }
}
