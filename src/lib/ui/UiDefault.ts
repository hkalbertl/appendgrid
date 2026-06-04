import type { I18nOptions } from '../types';
import type IconBase from '../icon/IconBase';
import UiBase from './UiBase';

class UiDefault extends UiBase {
    name: string;

    constructor(uiParams: Record<string, unknown> | null, i18n: I18nOptions, iconFramework: IconBase) {
        super(i18n, iconFramework);
        this.name = 'ui-default';
    }
}

export default UiDefault;
