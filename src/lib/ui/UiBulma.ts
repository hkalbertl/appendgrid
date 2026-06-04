import * as Util from '../util';
import type { ButtonType, ColumnOption, I18nOptions, SectionClasses } from '../types';
import type IconBase from '../icon/IconBase';
import UiBase from './UiBase';

interface BulmaParams {
    useButtonGroup: boolean;
    sectionClasses: Partial<SectionClasses> | null;
    sizing: string;
}

class UiBulma extends UiBase {
    name: string;
    protected uiParams: BulmaParams;

    constructor(uiParams: Record<string, unknown> | null, i18n: I18nOptions, iconFramework: IconBase) {
        super(i18n, iconFramework);
        this.name = 'ui-bulma';
        const libParams: BulmaParams = {
            useButtonGroup: true,
            sectionClasses: null,
            sizing: 'normal'
        };
        Object.assign(libParams, uiParams);
        const libSectionClasses: Partial<SectionClasses> = {
            table: 'table',
            control: 'input',
            button: 'button',
            buttonGroup: 'field has-addons',
            append: '',
            removeLast: '',
            insert: '',
            remove: '',
            moveUp: '',
            moveDown: '',
            empty: 'has-text-centered'
        };
        if (libParams.sizing === 'small') {
            libSectionClasses.table += ' is-narrow';
            libSectionClasses.control += ' is-small';
            libSectionClasses.button += ' is-small';
        } else if (libParams.sizing === 'medium') {
            libSectionClasses.control += ' is-medium';
            libSectionClasses.button += ' is-medium';
        } else if (libParams.sizing === 'large') {
            libSectionClasses.control += ' is-large';
            libSectionClasses.button += ' is-large';
        }
        if (libParams.sectionClasses) {
            Object.assign(libSectionClasses, libParams.sectionClasses);
        }
        this.applySectionClasses(libSectionClasses);
        this.uiParams = libParams;
    }

    generateButton(holder: HTMLElement, type: ButtonType, buttonId?: string): HTMLElement {
        const button = Util.createElem('button', buttonId ?? null, null, null, 'button');
        button.title = this.i18n[type];
        Util.applyClasses(button,
            this.getSectionClasses('button'),
            this.getSectionClasses(type));
        let container: HTMLElement;
        if (this.iconFramework.isTextBased) {
            container = button;
        } else {
            container = document.createElement('span');
            container.classList.add('icon');
            button.appendChild(container);
        }
        this.iconFramework.generateIcon(container, type);
        if (this.uiParams.useButtonGroup) {
            const wrapper = document.createElement('p');
            wrapper.classList.add('control');
            wrapper.appendChild(button);
            holder.appendChild(wrapper);
        } else {
            holder.appendChild(button);
        }
        return button;
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
        if (columnOpt.type === 'select') {
            const wrapper = Util.createElem('div', null, null, 'select');
            if (this.uiParams.sizing === 'small') {
                wrapper.classList.add('is-small');
            } else if (this.uiParams.sizing === 'medium') {
                wrapper.classList.add('is-medium');
            } else if (this.uiParams.sizing === 'large') {
                wrapper.classList.add('is-large');
            }
            ctrlHolder?.appendChild(wrapper);
            ctrl = super.generateControl(null, columnOpt, ctrlId, ctrlName);
            Util.applyClasses(ctrl, columnOpt.ctrlClass);
            wrapper.appendChild(ctrl);
        } else if (columnOpt.type === 'checkbox') {
            const wrapper = Util.createElem('label', null, null, 'checkbox');
            ctrlHolder?.appendChild(wrapper);
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'checkbox');
            (ctrl as HTMLInputElement).value = '1';
            Util.applyClasses(ctrl, columnOpt.ctrlClass);
            wrapper.appendChild(ctrl);
        } else if (columnOpt.type === 'readonly') {
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'text');
            Util.applyClasses(ctrl, this.getSectionClasses('control'), columnOpt.ctrlClass);
            ctrl.classList.add('is-static');
            (ctrl as HTMLInputElement).readOnly = true;
            ctrlHolder?.appendChild(ctrl);
        } else {
            ctrl = super.generateControl(ctrlHolder, columnOpt, ctrlId, ctrlName);
        }
        return ctrl;
    }
}

export default UiBulma;
