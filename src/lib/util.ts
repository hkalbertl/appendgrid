
export function applyClasses(element: Element, ...classNames: (string | null | undefined)[]): void {
    if (classNames && classNames.length) {
        classNames.forEach(function (item) {
            if (item) {
                const classes = item.split(/\s+/gi);
                if (classes && classes.length) {
                    classes.forEach(function (value) {
                        if (value) element.classList.add(value);
                    });
                }
            }
        });
    }
}

export function isEmpty(value: unknown): value is null | undefined {
    return value === undefined || value === null;
}

export function isNumeric(n: unknown): boolean {
    return !isNaN(parseFloat(n as string)) && isFinite(n as number);
}

export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function createElem(
    tagName: string,
    id: string | null = null,
    name: string | null = null,
    classes: string | null = null,
    type: string | null = null
): HTMLElement {
    const element = document.createElement(tagName) as HTMLElement & { name?: string; type?: string };
    if (id) element.id = id;
    if (name) element.name = name;
    if (classes) applyClasses(element, classes);
    if (type) element.type = type;
    return element;
}
