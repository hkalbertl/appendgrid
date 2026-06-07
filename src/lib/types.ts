export type ButtonType = 'append' | 'removeLast' | 'insert' | 'remove' | 'moveUp' | 'moveDown';

export interface IconSet {
    append: string | null;
    removeLast: string | null;
    insert: string | null;
    remove: string | null;
    moveUp: string | null;
    moveDown: string | null;
}

export interface I18nOptions {
    append: string;
    removeLast: string;
    insert: string;
    remove: string;
    moveUp: string;
    moveDown: string;
    rowEmpty: string;
}

export interface HideButtonsOptions {
    append: boolean;
    removeLast: boolean;
    insert: boolean;
    remove: boolean;
    moveUp: boolean;
    moveDown: boolean;
}

export interface SectionClasses {
    table: string | null;
    thead: string | null;
    theadRow: string | null;
    theadCell: string | null;
    tbody: string | null;
    tbodyRow: string | null;
    tbodyCell: string | null;
    tfoot: string | null;
    tfootRow: string | null;
    tfootCell: string | null;
    first: string | null;
    last: string | null;
    control: string | null;
    button: string | null;
    buttonGroup: string | null;
    append: string | null;
    removeLast: string | null;
    insert: string | null;
    remove: string | null;
    moveUp: string | null;
    moveDown: string | null;
    empty: string | null;
}

export interface CtrlOptionsItem {
    value: string;
    label: string;
    group?: string;
    title?: string;
}

export type CtrlOptionsType =
    | CtrlOptionsItem[]
    | string[]
    | Record<string, string>
    | string
    | ((ctrl: HTMLSelectElement) => void);

export interface ColumnOption {
    type: string;
    name: string;
    value?: string | number | boolean | null;
    display?: string | ((cell: HTMLTableCellElement) => void) | null;
    displayCss?: Record<string, string> | null;
    displayClass?: string | null;
    displayTooltip?: string | null;
    headerSpan?: number;
    cellCss?: Record<string, string> | null;
    cellClass?: string | null;
    ctrlAttr?: Record<string, string> | null;
    ctrlProp?: Record<string, unknown> | null;
    ctrlCss?: Record<string, string> | null;
    ctrlClass?: string | null;
    ctrlOptions?: CtrlOptionsType | null;
    invisible?: boolean;
    emptyCriteria?: string | number | boolean | ((value: unknown) => boolean) | null;
    customBuilder?: ((cell: HTMLTableCellElement, idPrefix: string, name: string, uniqueIndex: number) => HTMLElement) | null;
    customGetter?: ((idPrefix: string, name: string, uniqueIndex: number) => unknown) | null;
    customSetter?: ((idPrefix: string, name: string, uniqueIndex: number, data: unknown) => void) | null;
    events?: Record<string, (evt: Event & { columnName?: string; uniqueIndex?: number }) => void> | null;
    ctrlAdded?: ((ctrl: HTMLElement, cell: HTMLTableCellElement, uniqueIndex: number) => void) | null;
}

export interface GridOption {
    element: HTMLTableElement | string;
    uiFramework?: string | null;
    uiParams?: Record<string, unknown> | null;
    iconFramework?: string | null;
    iconParams?: Record<string, unknown> | null;
    initRows?: number;
    idPrefix?: string | null;
    initData?: Record<string, unknown>[] | null;
    columns: ColumnOption[];
    i18n?: Partial<I18nOptions> | null;
    hideButtons?: Partial<HideButtonsOptions> | null;
    hideRowNumColumn?: boolean;
    rowButtonsInFront?: boolean;
    rowCountName?: string;
    sectionClasses?: Partial<SectionClasses> | null;
    maxRowsAllowed?: number;
    nameFormatter?: ((idPrefix: string, name: string, uniqueIndex: number) => string) | null;
    dataLoaded?: ((table: HTMLTableElement, records: Record<string, unknown>[]) => void) | null;
    rowDataLoaded?: ((table: HTMLTableElement, record: Record<string, unknown>, rowIndex: number, uniqueIndex: number) => void) | null;
    afterRowAppended?: ((table: HTMLTableElement, parentIndex: number | null, addedRows: number[]) => void) | null;
    afterRowInserted?: ((table: HTMLTableElement, parentIndex: number | null, addedRows: number[]) => void) | null;
    afterRowSwapped?: ((table: HTMLTableElement, oldIndex: number, newIndex: number) => void) | null;
    beforeRowRemove?: ((table: HTMLTableElement, rowIndex: number) => boolean) | null;
    afterRowRemoved?: ((table: HTMLTableElement, rowIndex: number | null) => void) | null;
    maxNumRowsReached?: ((table: HTMLTableElement) => void) | null;
}

export interface GridSettings {
    element: HTMLTableElement;
    uiFramework: string | null;
    uiParams: Record<string, unknown> | null;
    iconFramework: string | null;
    iconParams: Record<string, unknown> | null;
    initRows: number;
    idPrefix: string;
    initData: Record<string, unknown>[] | null;
    columns: ColumnOption[];
    i18n: I18nOptions;
    hideButtons: HideButtonsOptions;
    hideRowNumColumn: boolean;
    rowButtonsInFront: boolean;
    rowCountName: string;
    sectionClasses: Partial<SectionClasses> | null;
    maxRowsAllowed: number;
    nameFormatter?: ((idPrefix: string, name: string, uniqueIndex: number) => string) | null;
    dataLoaded?: ((table: HTMLTableElement, records: Record<string, unknown>[]) => void) | null;
    rowDataLoaded?: ((table: HTMLTableElement, record: Record<string, unknown>, rowIndex: number, uniqueIndex: number) => void) | null;
    afterRowAppended?: ((table: HTMLTableElement, parentIndex: number | null, addedRows: number[]) => void) | null;
    afterRowInserted?: ((table: HTMLTableElement, parentIndex: number | null, addedRows: number[]) => void) | null;
    afterRowSwapped?: ((table: HTMLTableElement, oldIndex: number, newIndex: number) => void) | null;
    beforeRowRemove?: ((table: HTMLTableElement, rowIndex: number) => boolean) | null;
    afterRowRemoved?: ((table: HTMLTableElement, rowIndex: number | null) => void) | null;
    maxNumRowsReached?: ((table: HTMLTableElement) => void) | null;
}

export interface InsertRowResult {
    addedRows: number[];
    parentIndex: number | null;
    rowIndex: number | null;
}
