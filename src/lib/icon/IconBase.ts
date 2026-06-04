import type { ButtonType, IconSet } from '../types';

abstract class IconBase {
    name: string;
    icons: IconSet;
    isTextBased: boolean;

    constructor(name: string, isTextBased = false) {
        this.name = name;
        this.icons = {
            append: null,
            removeLast: null,
            insert: null,
            remove: null,
            moveUp: null,
            moveDown: null
        };
        this.isTextBased = isTextBased;
    }

    abstract generateIcon(container: HTMLElement, type: ButtonType): Node;
}

export default IconBase;
