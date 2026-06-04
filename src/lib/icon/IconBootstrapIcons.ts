import * as Util from '../util';
import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconBootstrapIcons extends IconBase {
    private baseUrl: string;

    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-bootstrapicons');
        const libParams = {
            baseUrl: '',
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'plus',
            removeLast: 'dash',
            insert: 'arrow-90deg-left',
            remove: 'trash',
            moveUp: 'chevron-up',
            moveDown: 'chevron-down'
        };
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
        this.baseUrl = libParams.baseUrl;
    }

    generateIcon(container: HTMLElement, type: ButtonType): Node {
        const icon = document.createElement('img') as HTMLImageElement;
        icon.src = this.baseUrl + this.icons[type] + '.svg';
        Util.applyClasses(icon, this.icons[type]);
        container.appendChild(icon);
        return icon;
    }
}

export default IconBootstrapIcons;
