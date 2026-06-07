import * as Util from '../util';
import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconFontAwesome7 extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-fontawesome7');
        const libParams = {
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'fa-solid fa-plus',
            removeLast: 'fa-solid fa-minus',
            insert: 'fa-solid fa-reply',
            remove: 'fa-solid fa-xmark',
            moveUp: 'fa-solid fa-angle-up',
            moveDown: 'fa-solid fa-angle-down'
        };
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
    }

    generateIcon(container: HTMLElement, type: ButtonType): Node {
        const icon = document.createElement('i');
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconFontAwesome7;
