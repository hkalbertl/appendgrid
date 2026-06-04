import * as Util from '../util';
import type { I18nOptions, SectionClasses } from '../types';
import type IconBase from '../icon/IconBase';
import UiBase from './UiBase';

interface Foundation6Params {
    useButtonGroup: boolean;
    sectionClasses: Partial<SectionClasses> | null;
}

class UiFoundation6 extends UiBase {
    name: string;
    protected uiParams: Foundation6Params;

    constructor(uiParams: Record<string, unknown> | null, i18n: I18nOptions, iconFramework: IconBase) {
        super(i18n, iconFramework);
        this.name = 'ui-foundation6';
        const libParams: Foundation6Params = {
            useButtonGroup: true,
            sectionClasses: null
        };
        Object.assign(libParams, uiParams);
        const libSectionClasses: Partial<SectionClasses> = {
            button: 'button',
            buttonGroup: 'button-group'
        };
        if (libParams.sectionClasses) {
            Object.assign(libSectionClasses, libParams.sectionClasses);
        }
        this.applySectionClasses(libSectionClasses);
        this.uiParams = libParams;
    }

    createButtonGroup(): HTMLElement | null {
        if (this.uiParams.useButtonGroup) {
            const group = document.createElement('div');
            Util.applyClasses(group, this.getSectionClasses('buttonGroup'));
            return group;
        }
        return super.createButtonGroup();
    }
}

export default UiFoundation6;
