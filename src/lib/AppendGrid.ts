import GridCore from './GridCore';
import * as Util from './util';
import type { ColumnOption, GridOption } from './types';

const _defaultGridOptions: Partial<GridOption> = {
    uiFramework: null,
    uiParams: null,
    iconFramework: null,
    iconParams: null,
    initRows: 3,
    idPrefix: null,
    initData: null,
    columns: [],
    i18n: null,
    hideButtons: null,
    hideRowNumColumn: false,
    rowButtonsInFront: false,
    rowCountName: '_RowCount',
    sectionClasses: null,
    maxRowsAllowed: 0
};

const _defaultCallbackContainer: Partial<GridOption> = {
    nameFormatter: null,
    dataLoaded: null,
    rowDataLoaded: null,
    afterRowAppended: null,
    afterRowInserted: null,
    afterRowSwapped: null,
    beforeRowRemove: null,
    afterRowRemoved: null,
    maxNumRowsReached: null
};

const _defaultColumnOptions: Partial<ColumnOption> = {
    type: 'text',
    name: undefined,
    value: null,
    display: null,
    displayCss: null,
    displayClass: null,
    displayTooltip: null,
    headerSpan: 1,
    cellCss: null,
    cellClass: null,
    ctrlAttr: null,
    ctrlProp: null,
    ctrlCss: null,
    ctrlClass: null,
    ctrlOptions: null,
    invisible: false,
    emptyCriteria: null,
    customBuilder: null,
    customGetter: null,
    customSetter: null,
    events: null,
    ctrlAdded: null
};

class AppendGrid {

    #grid: GridCore;

    constructor(options: GridOption) {
        const params = Object.assign({}, _defaultGridOptions, _defaultCallbackContainer, options);

        const i18n = {
            append: 'Append Row',
            removeLast: 'Remove Last Row',
            insert: 'Insert Row Above',
            remove: 'Remove Current Row',
            moveUp: 'Move Up',
            moveDown: 'Move Down',
            rowEmpty: 'This Grid Is Empty'
        };
        if (params.i18n) {
            Object.assign(i18n, params.i18n);
        }
        params.i18n = i18n;

        const hideButtons = {
            append: false,
            removeLast: false,
            insert: false,
            remove: false,
            moveUp: false,
            moveDown: false
        };
        if (params.hideButtons) {
            Object.assign(hideButtons, params.hideButtons);
        }
        params.hideButtons = hideButtons;

        for (let z = 0; z < params.columns!.length; z++) {
            params.columns![z] = Object.assign({}, _defaultColumnOptions, params.columns![z]) as ColumnOption;
        }

        const gridCore = new GridCore(params as GridOption);
        this.#grid = gridCore;

        if (Array.isArray(params.initData)) {
            gridCore.loadData(params.initData as Record<string, unknown>[]);
        } else if ((params.initRows ?? 0) > 0) {
            gridCore.insertRow(params.initRows!);
        }
    }

    appendRow(numOfRowOrRowArray?: number | Record<string, unknown>[]): number[] {
        const result = this.#grid.insertRow(numOfRowOrRowArray ?? 1);
        return result.addedRows;
    }

    insertRow(numOfRowOrRowArray: number | Record<string, unknown>[], rowIndex?: number): number[] {
        const result = this.#grid.insertRow(numOfRowOrRowArray, rowIndex);
        return result.addedRows;
    }

    removeRow(rowIndex: number): void {
        this.#grid.removeRow(rowIndex);
    }

    moveUpRow(rowIndex: number): void {
        this.#grid.moveUpRow(rowIndex);
    }

    moveDownRow(rowIndex: number): void {
        this.#grid.moveDownRow(rowIndex);
    }

    load(records: Record<string, unknown>[]): void {
        this.#grid.loadData(records);
    }

    getAllValue(objectMode?: boolean): Record<string, unknown> | unknown[] {
        const grid = this.#grid;
        const result: Record<string, unknown> | unknown[] = objectMode ? {} : [];
        grid.rowOrder.forEach(function (uniqueIndex, arrayIndex) {
            if (objectMode) {
                Object.assign(result as Record<string, unknown>, grid.getRowValue(uniqueIndex, arrayIndex));
            } else {
                (result as unknown[]).push(grid.getRowValue(uniqueIndex));
            }
        });
        if (objectMode) {
            (result as Record<string, unknown>)[grid.settings.rowCountName] = grid.rowOrder.length;
        }
        return result;
    }

    getUniqueIndex(rowIndex: number): number | null {
        const rowOrder = this.#grid.rowOrder;
        if (rowIndex >= 0 && rowIndex < rowOrder.length) {
            return rowOrder[rowIndex];
        }
        return null;
    }

    getRowIndex(uniqueIndex: number): number | null {
        const rowOrder = this.#grid.rowOrder;
        for (let r = 0; r < rowOrder.length; r++) {
            if (rowOrder[r] === uniqueIndex) {
                return r;
            }
        }
        return null;
    }

    getRowCount(): number {
        return this.#grid.rowOrder.length;
    }

    getRowOrder(): number[] {
        return this.#grid.rowOrder.slice();
    }

    getRowValue(rowIndex: number): Record<string, unknown> | null {
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (uniqueIndex !== null) {
            return this.#grid.getRowValue(uniqueIndex);
        }
        return null;
    }

    getCtrlValue(name: string, rowIndex: number): unknown {
        const colIndex = this.#grid.getColumnIndex(name);
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (colIndex !== null && uniqueIndex !== null) {
            return this.#grid.getCtrlValue(colIndex, uniqueIndex);
        }
        return null;
    }

    setCtrlValue(name: string, rowIndex: number, value: unknown): void {
        const colIndex = this.#grid.getColumnIndex(name);
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (colIndex !== null && uniqueIndex !== null) {
            this.#grid.setCtrlValue(colIndex, uniqueIndex, value);
        }
    }

    getColumns(): ColumnOption[] {
        return this.#grid.settings.columns.slice();
    }

    getCellCtrl(name: string, rowIndex: number): HTMLElement | null {
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        return this.getCellCtrlByUniqueIndex(name, uniqueIndex);
    }

    getCellCtrlByUniqueIndex(name: string, uniqueIndex: number | null): HTMLElement | null {
        const grid = this.#grid;
        const colIndex = grid.getColumnIndex(name);
        if (colIndex !== null && Util.isNumeric(uniqueIndex)) {
            return grid.getCellCtrl(grid.settings.idPrefix, name, uniqueIndex!);
        }
        return null;
    }

    isRowEmpty(rowIndex: number): boolean {
        const uniqueIndex = this.getUniqueIndex(rowIndex);
        if (uniqueIndex !== null) {
            return this.#grid.isRowEmpty(uniqueIndex);
        }
        return true;
    }

    removeEmptyRows(): void {
        const grid = this.#grid, rowOrder = this.getRowOrder();
        for (let r = 0; r < rowOrder.length; r++) {
            if (grid.isRowEmpty(rowOrder[r])) {
                grid.removeRow(null, rowOrder[r], true);
            }
        }
    }
}

export default AppendGrid;
