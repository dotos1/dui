
import { ɵInvertedKeysOfType } from '../../../core/types';
import { ɵDragStrategyEnum } from '../../enums';


export class DragStrategyByTranslate3d {

    public readonly type = ɵDragStrategyEnum.ByTranslate3d;

    public isLockAxisX?: boolean = false;

    public isLockAxisY?: boolean = false;

    constructor(params?: ɵInvertedKeysOfType<DragStrategyByTranslate3d, ɵDragStrategyEnum>) {
        Object.assign(this, params);
    }
}
