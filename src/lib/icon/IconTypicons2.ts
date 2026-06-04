import * as Util from '../util';
import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconTypicons2 extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-typicons2');
        const libParams = {
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'typcn typcn-plus',
            removeLast: 'typcn typcn-minus',
            insert: 'typcn typcn-arrow-back',
            remove: 'typcn typcn-times',
            moveUp: 'typcn typcn-arrow-sorted-up',
            moveDown: 'typcn typcn-arrow-sorted-down'
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

export default IconTypicons2;
