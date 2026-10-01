
import { ɵInvertedKeysOfType } from '../../../core/types/inverted-keys-of.type';
import { ɵDragStrategyEnum } from '../../enums';


export class DragStrategyByAxisProperties {
    /** @internal */
    public readonly type = ɵDragStrategyEnum.ByAxisProperties;

    public xAxisLeftStyleProperty?: string = 'left';

    public yAxisTopStyleProperty?: string = 'top';

    constructor(params?: ɵInvertedKeysOfType<DragStrategyByAxisProperties, ɵDragStrategyEnum>) {
        Object.assign(this, params);
    }
}
