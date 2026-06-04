import type { ButtonType } from '../types';
import IconBase from './IconBase';

class IconDefault extends IconBase {
    constructor(iconParams?: Record<string, unknown> | null) {
        super('icon-default', true);
        Object.assign(this.icons, {
            append: '＋',
            removeLast: '－',
            insert: '↜',
            remove: '✕',
            moveUp: '▲',
            moveDown: '▼'
        });
        if (iconParams) {
            Object.assign(this.icons, iconParams);
        }
    }

    generateIcon(container: HTMLElement, type: ButtonType): Node {
        const label = document.createTextNode(this.icons[type] || '');
        container.appendChild(label);
        return label;
    }
}

export default IconDefault;
