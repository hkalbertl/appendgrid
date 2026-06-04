import * as Util from '../util';
import type { ButtonType, ColumnOption, CtrlOptionsItem, I18nOptions, SectionClasses } from '../types';
import type IconBase from '../icon/IconBase';

class UiBase {
    protected i18n: I18nOptions;
    protected iconFramework: IconBase;
    protected sectionClasses: SectionClasses;

    constructor(i18n: I18nOptions, iconFramework: IconBase) {
        this.i18n = i18n;
        this.iconFramework = iconFramework;
        this.sectionClasses = {
            table: null,
            thead: null,
            theadRow: null,
            theadCell: null,
            tbody: null,
            tbodyRow: null,
            tbodyCell: null,
            tfoot: null,
            tfootRow: null,
            tfootCell: null,
            first: null,
            last: null,
            control: null,
            button: null,
            buttonGroup: null,
            append: null,
            removeLast: null,
            insert: null,
            remove: null,
            moveUp: null,
            moveDown: null,
            empty: null
        };
    }

    applySectionClasses(classes: Partial<SectionClasses>): void {
        for (const key in this.sectionClasses) {
            const sectionKey = key as keyof SectionClasses;
            if (classes[sectionKey]) {
                if (this.sectionClasses[sectionKey]) {
                    this.sectionClasses[sectionKey] += ' ' + classes[sectionKey];
                } else {
                    this.sectionClasses[sectionKey] = classes[sectionKey]!;
                }
            }
        }
    }

    getSectionClasses(section: string): string | null {
        return this.sectionClasses[section as keyof SectionClasses] ?? null;
    }

    createButtonGroup(): HTMLElement | null {
        return null;
    }

    generateButton(holder: HTMLElement, type: ButtonType, buttonId?: string): HTMLElement {
        const button = Util.createElem('button', buttonId ?? null, null, null, 'button');
        button.title = this.i18n[type];
        Util.applyClasses(button,
            this.getSectionClasses('button'),
            this.getSectionClasses(type));
        holder.appendChild(button);
        this.iconFramework.generateIcon(button, type);
        return button;
    }

    generateControl(ctrlHolder: HTMLElement | null, columnOpt: ColumnOption, ctrlId: string, ctrlName: string): HTMLElement {
        let ctrl: HTMLElement;
        if (columnOpt.type === 'select') {
            const select = document.createElement('select');
            select.id = ctrlId;
            (select as HTMLSelectElement & { name: string }).name = ctrlName;
            ctrl = select;
            if (Array.isArray(columnOpt.ctrlOptions)) {
                if (columnOpt.ctrlOptions.length > 0) {
                    if (Util.isPlainObject(columnOpt.ctrlOptions[0])) {
                        let lastGroupName: string | null = null;
                        let lastGroupElem: HTMLOptGroupElement | null = null;
                        for (let x = 0; x < columnOpt.ctrlOptions.length; x++) {
                            const optItem = columnOpt.ctrlOptions[x] as CtrlOptionsItem;
                            if (!Util.isEmpty(optItem.group)) {
                                if (lastGroupName !== optItem.group) {
                                    lastGroupName = optItem.group!;
                                    lastGroupElem = document.createElement('optgroup');
                                    lastGroupElem.label = lastGroupName;
                                    select.appendChild(lastGroupElem);
                                }
                            } else {
                                lastGroupElem = null;
                            }
                            const option = document.createElement('option');
                            option.value = optItem.value;
                            option.innerText = optItem.label;
                            if (!Util.isEmpty(optItem.title)) {
                                option.setAttribute('title', optItem.title!);
                            }
                            (lastGroupElem ?? select).appendChild(option);
                        }
                    } else {
                        for (let x = 0; x < columnOpt.ctrlOptions.length; x++) {
                            const opValue = columnOpt.ctrlOptions[x] as string;
                            select.options[select.options.length] = new Option(opValue, opValue);
                        }
                    }
                }
            } else if (Util.isPlainObject(columnOpt.ctrlOptions)) {
                const opts = columnOpt.ctrlOptions as Record<string, string>;
                for (const x in opts) {
                    select.options[select.options.length] = new Option(opts[x], x);
                }
            } else if (typeof columnOpt.ctrlOptions === 'string') {
                const arrayOpt = columnOpt.ctrlOptions.split(';');
                for (let x = 0; x < arrayOpt.length; x++) {
                    const eqIndex = arrayOpt[x].indexOf(':');
                    if (eqIndex === -1) {
                        select.options[select.options.length] = new Option(arrayOpt[x], arrayOpt[x]);
                    } else {
                        select.options[select.options.length] = new Option(
                            arrayOpt[x].substring(eqIndex + 1),
                            arrayOpt[x].substring(0, eqIndex)
                        );
                    }
                }
            } else if (typeof columnOpt.ctrlOptions === 'function') {
                columnOpt.ctrlOptions(select);
            }
        } else if (columnOpt.type === 'checkbox') {
            ctrl = Util.createElem('input', ctrlId, ctrlName, null, 'checkbox');
            (ctrl as HTMLInputElement).value = '1';
        } else if (columnOpt.type === 'textarea') {
            ctrl = Util.createElem('textarea', ctrlId, ctrlName);
        } else if (/^(color|date|datetime|datetime-local|email|month|number|range|search|tel|time|url|week)$/.test(columnOpt.type)) {
            ctrl = Util.createElem('input', ctrlId, ctrlName);
            try {
                (ctrl as HTMLInputElement).type = columnOpt.type;
            } catch (err) { /* Not supported type */ }
        } else {
            ctrl = Util.createElem('input', ctrlId, ctrlName);
            (ctrl as HTMLInputElement).type = 'text';
        }
        Util.applyClasses(ctrl!, this.getSectionClasses('control'), columnOpt.ctrlClass);
        if (ctrlHolder) ctrlHolder.appendChild(ctrl!);
        return ctrl!;
    }
}

export default UiBase;
