import * as Util from '../util';
import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconFontAwesome5 extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-fontawesome5');
        const libParams = {
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'fas fa-plus',
            removeLast: 'fas fa-minus',
            insert: 'fas fa-reply',
            remove: 'fas fa-times',
            moveUp: 'fas fa-angle-up',
            moveDown: 'fas fa-angle-down'
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

export default IconFontAwesome5;
