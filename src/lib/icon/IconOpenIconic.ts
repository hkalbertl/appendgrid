import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconOpenIconic extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-openiconic');
        const libParams = {
            icons: null as Record<string, string> | null
        };
        Object.assign(libParams, iconParams);
        const icons = {
            append: 'plus',
            removeLast: 'minus',
            insert: 'share',
            remove: 'x',
            moveUp: 'chevron-top',
            moveDown: 'chevron-bottom'
        };
        if (libParams.icons) {
            Object.assign(icons, libParams.icons);
        }
        this.icons = icons;
    }

    generateIcon(container: HTMLElement, type: ButtonType): Node {
        const icon = document.createElement('span');
        icon.className = 'oi';
        icon.dataset.glyph = this.icons[type] ?? undefined;
        icon.setAttribute('aria-hidden', 'true');
        container.appendChild(icon);
        return icon;
    }
}

export default IconOpenIconic;
