import * as Util from '../util';
import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconIonicons4 extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-ionicon4');
        const libParams = {
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'icon ion-md-add',
            removeLast: 'icon ion-md-remove',
            insert: 'icon ion-md-undo',
            remove: 'icon ion-md-close',
            moveUp: 'icon ion-md-arrow-dropup',
            moveDown: 'icon ion-md-arrow-dropdown'
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

export default IconIonicons4;
