import * as Util from '../util';
import type { ColumnOption, I18nOptions, SectionClasses } from '../types';
import type IconBase from '../icon/IconBase';
import UiBase from './UiBase';

interface Bootstrap5Params {
    useButtonGroup: boolean;
    sectionClasses: Partial<SectionClasses> | null;
    sizing: string;
}

class UiBootstrap5 extends UiBase {
    name: string;
    protected uiParams: Bootstrap5Params;

    constructor(uiParams: Record<string, unknown> | null, i18n: I18nOptions, iconFramework: IconBase) {
        super(i18n, iconFramework);
        this.name = 'ui-bootstrap5';
        const libParams: Bootstrap5Params = {
            useButtonGroup: true,
            sectionClasses: null,
            sizing: 'normal'
        };
        Object.assign(libParams, uiParams);
        const libSectionClasses: Partial<SectionClasses> = {
            table: 'table',
            thead: 'table-light',
            control: 'form-control',
            button: 'btn',
            buttonGroup: 'btn-group',
            append: 'btn-outline-secondary',
            removeLast: 'btn-outline-secondary',
            insert: 'btn-outline-secondary',
            remove: 'btn-outline-secondary',
            moveUp: 'btn-outline-secondary',
            moveDown: 'btn-outline-secondary',
            empty: 'text-center'
        };
        if (libParams.sizing === 'small') {
            libSectionClasses.table += ' table-sm';
            libSectionClasses.buttonGroup += ' btn-group-sm';
            libSectionClasses.control += ' form-control-sm';
        } else if (libParams.sizing === 'large') {
            libSectionClasses.buttonGroup += ' btn-group-lg';
            libSectionClasses.control += ' form-control-lg';
        }
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

    generateControl(ctrlHolder: HTMLElement | null, columnOpt: ColumnOption, ctrlId: string, ctrlName: string): HTMLElement {
        let ctrl: HTMLElement;
        if (columnOpt.type === 'checkbox') {
            ctrl = Util.createElem('input', ctrlId, ctrlName, 'form-check-input');
            (ctrl as HTMLInputElement).type = 'checkbox';
            (ctrl as HTMLInputElement).value = '1';
            Util.applyClasses(ctrl, columnOpt.ctrlClass);
            ctrlHolder?.appendChild(ctrl);
        } else if (columnOpt.type === 'readonly') {
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'text');
            Util.applyClasses(ctrl, this.getSectionClasses('control'), columnOpt.ctrlClass);
            ctrl.classList.remove('form-control');
            ctrl.classList.add('form-control-plaintext');
            (ctrl as HTMLInputElement).readOnly = true;
            ctrlHolder?.appendChild(ctrl);
        } else {
            ctrl = super.generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName);
        }
        return ctrl;
    }
}

export default UiBootstrap5;
