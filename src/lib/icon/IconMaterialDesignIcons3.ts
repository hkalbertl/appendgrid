import * as Util from '../util';
import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconMaterialDesignIcons3 extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-materialdesignicons3');
        const libParams = {
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'mdi mdi-plus',
            removeLast: 'mdi mdi-minus',
            insert: 'mdi mdi-reply',
            remove: 'mdi mdi-close',
            moveUp: 'mdi mdi-chevron-up',
            moveDown: 'mdi mdi-chevron-down'
        };
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
    }

    generateIcon(container: HTMLElement, type: ButtonType): Node {
        const icon = document.createElement('span');
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconMaterialDesignIcons3;
