import IconDefault from './icon/IconDefault';
import IconBootstrapIcons from './icon/IconBootstrapIcons';
import IconFontAwesome6 from './icon/IconFontAwesome6';
import IconFontAwesome5 from './icon/IconFontAwesome5';
import IconMaterialDesignIcons3 from './icon/IconMaterialDesignIcons3';
import IconIonicons4 from './icon/IconIonicons4';
import IconTypicons2 from './icon/IconTypicons2';
import IconOpenIconic from './icon/IconOpenIconic';
import UiDefault from './ui/UiDefault';
import UiBootstrap4 from './ui/UiBootstrap4';
import UiBootstrap5 from './ui/UiBootstrap5';
import UiBulma from './ui/UiBulma';
import UiFoundation6 from './ui/UiFoundation6';
import * as Util from './util';
import type { ButtonType, ColumnOption, GridOption, GridSettings, InsertRowResult } from './types';
import type IconBase from './icon/IconBase';
import type UiBase from './ui/UiBase';

class GridCore {
    rowOrder: number[] = [];
    settings!: GridSettings;

    private uniqueIndex: number = 0;
    private visibleCount: number = 0;
    private finalColSpan: number = 0;
    private hideLastColumn: boolean = false;
    private tbWhole!: HTMLTableElement;
    private tbBody!: HTMLTableSectionElement;
    private iconFramework!: IconBase;
    private uiFramework!: UiBase;

    constructor(options: GridOption) {
        const self = this;

        const settings = Object.assign({}, options) as GridSettings;
        self.settings = settings;
        console.debug('ag:Options initialized');

        let tbWhole: HTMLTableElement | null = null;
        if (typeof settings.element === 'string') {
            tbWhole = document.getElementById(settings.element) as HTMLTableElement | null;
        } else {
            tbWhole = settings.element as HTMLTableElement;
        }
        if (!tbWhole || !tbWhole.tagName || tbWhole.tagName !== 'TABLE') {
            throw '*element* is not defined or is not a table DOM element.';
        }
        self.tbWhole = tbWhole;
        tbWhole.innerHTML = '';
        console.debug('ag:Checked element');

        if (settings.iconFramework === 'bootstrapicons') {
            self.iconFramework = new IconBootstrapIcons(settings.iconParams);
        } else if (settings.iconFramework === 'fontawesome6') {
            self.iconFramework = new IconFontAwesome6(settings.iconParams);
        } else if (settings.iconFramework === 'fontawesome5') {
            self.iconFramework = new IconFontAwesome5(settings.iconParams);
        } else if (settings.iconFramework === 'ionicon4') {
            self.iconFramework = new IconIonicons4(settings.iconParams);
        } else if (settings.iconFramework === 'materialdesignicons3') {
            self.iconFramework = new IconMaterialDesignIcons3(settings.iconParams);
        } else if (settings.iconFramework === 'openiconic') {
            self.iconFramework = new IconOpenIconic(settings.iconParams);
        } else if (settings.iconFramework === 'typicons2') {
            self.iconFramework = new IconTypicons2(settings.iconParams);
        } else if (!settings.iconFramework || settings.iconFramework === 'default') {
            self.iconFramework = new IconDefault(settings.iconParams);
        } else {
            throw `Unknown Icon framework *${settings.iconFramework}*.`;
        }
        console.debug('ag:Checked icon framework');

        if (settings.uiFramework === 'bootstrap4') {
            self.uiFramework = new UiBootstrap4(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (settings.uiFramework === 'bootstrap5') {
            self.uiFramework = new UiBootstrap5(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (settings.uiFramework === 'bulma') {
            self.uiFramework = new UiBulma(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (settings.uiFramework === 'foundation6') {
            self.uiFramework = new UiFoundation6(settings.uiParams, settings.i18n, self.iconFramework);
        } else if (!settings.uiFramework || settings.uiFramework === 'default') {
            self.uiFramework = new UiDefault(settings.uiParams, settings.i18n, self.iconFramework);
        } else {
            throw `Unknown UI framework *${settings.uiFramework}*.`;
        }
        console.debug('ag:Checked ui framework');

        if (Util.isEmpty(settings.idPrefix)) {
            if (!tbWhole.id) {
                settings.idPrefix = 'ag' + new Date().getTime();
            } else {
                settings.idPrefix = tbWhole.id;
            }
            console.debug(`*idPrefix* = ${settings.idPrefix}`);
        }

        if (settings.sectionClasses) {
            self.uiFramework.applySectionClasses(settings.sectionClasses);
        }

        Util.applyClasses(tbWhole, self.uiFramework.getSectionClasses('table'));

        const thead = self.createElement('thead');
        tbWhole.appendChild(thead);
        let tbRow = self.createElement('tr', 'theadRow');
        thead.appendChild(tbRow);
        let tbCell: HTMLElement;
        let visibleCount = 0;
        if (!settings.hideRowNumColumn) {
            tbCell = self.createElement('th', 'theadCell');
            tbRow.appendChild(tbCell);
            visibleCount++;
        }
        let pendingSkipCol = 0;
        for (let z = 0; z < settings.columns.length; z++) {
            if (settings.columns[z].type === 'hidden') {
                continue;
            }
            if (pendingSkipCol === 0) {
                tbCell = self.createElement('th', 'theadCell');
                tbRow.appendChild(tbCell);
                Util.applyClasses(tbCell, settings.columns[z].displayClass);
                if (!Util.isEmpty(settings.columns[z].displayCss)) {
                    const displayCss = settings.columns[z].displayCss!;
                    for (const styleName in displayCss) {
                        (tbCell.style as unknown as Record<string, string>)[styleName] = displayCss[styleName];
                    }
                }
                if (settings.columns[z].headerSpan > 1) {
                    tbCell.setAttribute('colSpan', String(settings.columns[z].headerSpan));
                    pendingSkipCol = settings.columns[z].headerSpan - 1;
                }
                if (typeof settings.columns[z].display === 'function') {
                    (settings.columns[z].display as (cell: HTMLTableCellElement) => void)(tbCell as HTMLTableCellElement);
                } else if (settings.columns[z].display) {
                    tbCell.innerText = settings.columns[z].display as string;
                }
            } else {
                pendingSkipCol--;
            }
            visibleCount++;
        }
        tbCell = self.createElement('th', 'theadCell');
        if (settings.hideButtons.insert && settings.hideButtons.remove && settings.hideButtons.moveUp && settings.hideButtons.moveDown) {
            self.hideLastColumn = true;
            tbCell.style.display = 'none';
        } else {
            visibleCount++;
        }
        if (!self.hideLastColumn && settings.rowButtonsInFront) {
            if (settings.hideRowNumColumn) {
                tbRow.insertBefore(tbCell, tbRow.firstChild);
            } else {
                tbRow.insertBefore(tbCell, tbRow.childNodes[1]);
            }
        } else {
            tbRow.appendChild(tbCell);
        }
        self.finalColSpan = visibleCount;

        const tbBody = self.createElement('tbody') as HTMLTableSectionElement;
        tbWhole.appendChild(tbBody);
        self.tbBody = tbBody;

        const tfoot = self.createElement('tfoot');
        tbWhole.appendChild(tfoot);
        tbRow = self.createElement('tr', 'tfootRow');
        tfoot.appendChild(tbRow);
        tbCell = self.createElement('td', 'tfootCell');
        (tbCell as HTMLTableCellElement).colSpan = self.finalColSpan;
        tbRow.appendChild(tbCell);

        const rowOrderName = settings.idPrefix + '_rowOrder';
        const rowOrderCtrl = Util.createElem('input', rowOrderName, rowOrderName, null, 'hidden');
        tbCell.appendChild(rowOrderCtrl);

        if (settings.hideButtons.append && settings.hideButtons.removeLast) {
            (tbRow as HTMLElement).style.display = 'none';
        } else {
            let buttonContainer = self.uiFramework.createButtonGroup();
            if (buttonContainer) {
                tbCell.appendChild(buttonContainer);
            } else {
                buttonContainer = tbCell;
            }
            if (!settings.hideButtons.append) {
                const appendButton = self.uiFramework.generateButton(buttonContainer, 'append');
                appendButton.addEventListener('click', function () {
                    self.insertRow(1);
                });
            }
            if (!settings.hideButtons.removeLast) {
                const removeLastButton = self.uiFramework.generateButton(buttonContainer, 'removeLast');
                removeLastButton.addEventListener('click', function () {
                    self.removeRow();
                });
            }
        }

        this.showEmptyMessage();
        console.debug('ag:Initialized');
    }

    createElement(elementName: string, sectionName?: string, elementId?: string): HTMLElement {
        const classNames = this.uiFramework.getSectionClasses(sectionName || elementName);
        return Util.createElem(elementName, elementId ?? null, null, classNames);
    }

    loadData(records: Record<string, unknown>[], isInit = false): void {
        if (!Array.isArray(records) || !records.length) {
            throw '*records* should be in array format!';
        }

        const self = this;
        const settings = self.settings;
        self.tbBody.innerHTML = '';
        self.rowOrder.length = 0;
        self.uniqueIndex = 0;

        const insertResult = self.insertRow(records.length);

        for (let r = 0; r < insertResult.addedRows.length; r++) {
            for (let c = 0; c < settings.columns.length; c++) {
                self.setCtrlValue(c, self.rowOrder[r], records[r][settings.columns[c].name]);
            }
            if (typeof settings.rowDataLoaded === 'function') {
                settings.rowDataLoaded(self.tbWhole, records[r], r, self.rowOrder[r]);
            }
        }

        if (isInit) self.settings.initData = null;

        if (typeof settings.dataLoaded === 'function') {
            settings.dataLoaded(self.tbWhole, records);
        }
    }

    insertRow(
        numOfRowOrRowArray: number | Record<string, unknown>[],
        rowIndex?: number | null,
        callerUniqueIndex?: number | null
    ): InsertRowResult {
        const self = this;
        const settings = self.settings, uiFramework = self.uiFramework, tbBody = self.tbBody;
        let tbRow: HTMLElement, tbCell: HTMLElement;
        const addedRows: number[] = [];
        let parentIndex: number | null = null;
        let reachMaxRow = false;

        let numOfRow: number;
        let loadData = false;
        if (Array.isArray(numOfRowOrRowArray)) {
            numOfRow = numOfRowOrRowArray.length;
            loadData = true;
        } else {
            numOfRow = numOfRowOrRowArray;
        }

        let rowIdx: number | null = rowIndex ?? null;

        if (Util.isNumeric(callerUniqueIndex)) {
            for (let z = 0; z < self.rowOrder.length; z++) {
                if (self.rowOrder[z] === callerUniqueIndex) {
                    rowIdx = z;
                    if (z !== 0) parentIndex = z - 1;
                    break;
                }
            }
        } else if (Util.isNumeric(rowIdx)) {
            if (rowIdx! >= self.rowOrder.length) {
                rowIdx = null;
            } else {
                parentIndex = rowIdx! - 1;
            }
        } else if (self.rowOrder.length !== 0) {
            rowIdx = null;
            parentIndex = self.rowOrder.length - 1;
        }

        if (self.rowOrder.length === 0) {
            tbBody.innerHTML = '';
        }

        for (let z = 0; z < numOfRow; z++) {
            if (0 < settings.maxRowsAllowed && self.rowOrder.length >= settings.maxRowsAllowed) {
                reachMaxRow = true;
                break;
            }
            const uniqueIndex = ++self.uniqueIndex;
            const hiddenColumns: number[] = [];
            tbRow = self.createElement('tr', 'tbodyRow', settings.idPrefix + '_$row_' + uniqueIndex);
            (tbRow as HTMLElement & { dataset: DOMStringMap }).dataset.uniqueIndex = String(uniqueIndex);

            if (Util.isNumeric(rowIdx)) {
                const newRowIndex = rowIdx! + z;
                self.rowOrder.splice(newRowIndex, 0, uniqueIndex);
                tbBody.insertBefore(tbRow, tbBody.childNodes[newRowIndex]);
            } else {
                self.rowOrder.push(uniqueIndex);
                tbBody.appendChild(tbRow);
            }
            addedRows.push(uniqueIndex);

            if (!settings.hideRowNumColumn) {
                tbCell = self.createElement('td', 'tbodyCell', settings.idPrefix + '_$rowNum_' + uniqueIndex);
                tbCell.innerText = String(self.rowOrder.length);
                Util.applyClasses(tbCell, uiFramework.getSectionClasses('first'));
                tbRow.appendChild(tbCell);
            }

            for (let y = 0; y < settings.columns.length; y++) {
                if (settings.columns[y].type === 'hidden') {
                    hiddenColumns.push(y);
                    continue;
                }
                tbCell = self.createElement('td', 'tbodyCell');
                tbRow.appendChild(tbCell);
                Util.applyClasses(tbCell, settings.columns[y].cellClass);
                if (!Util.isEmpty(settings.columns[y].cellCss)) {
                    const cellCss = settings.columns[y].cellCss!;
                    for (const styleName in cellCss) {
                        (tbCell.style as unknown as Record<string, string>)[styleName] = cellCss[styleName];
                    }
                }

                const ctrlId = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                let ctrlName: string;
                if (typeof settings.nameFormatter === 'function') {
                    ctrlName = settings.nameFormatter(settings.idPrefix, settings.columns[y].name, uniqueIndex);
                } else {
                    ctrlName = ctrlId;
                }

                let ctrl: HTMLElement | null = null;
                const isCustom = (settings.columns[y].type === 'custom');
                if (isCustom) {
                    if (typeof settings.columns[y].customBuilder === 'function') {
                        ctrl = settings.columns[y].customBuilder!(tbCell as HTMLTableCellElement, settings.idPrefix, settings.columns[y].name, uniqueIndex);
                    }
                } else {
                    ctrl = self.uiFramework.generateControl(tbCell, settings.columns[y], ctrlId, ctrlName);
                    if (!Util.isEmpty(settings.columns[y].ctrlAttr)) {
                        const ctrlAttr = settings.columns[y].ctrlAttr!;
                        for (const attrName in ctrlAttr) {
                            ctrl!.setAttribute(attrName, ctrlAttr[attrName]);
                        }
                    }
                    if (!Util.isEmpty(settings.columns[y].ctrlCss)) {
                        const ctrlCss = settings.columns[y].ctrlCss!;
                        for (const cssName in ctrlCss) {
                            (ctrl!.style as unknown as Record<string, string>)[cssName] = ctrlCss[cssName];
                        }
                    }
                    if (settings.columns[y].events) {
                        (ctrl as HTMLElement & { dataset: DOMStringMap }).dataset.columnName = settings.columns[y].name;
                        (ctrl as HTMLElement & { dataset: DOMStringMap }).dataset.uniqueIndex = String(uniqueIndex);
                        for (const name in settings.columns[y].events) {
                            const ctrlHandler = settings.columns[y].events![name];
                            ctrl!.addEventListener(name, function (evt: Event) {
                                const target = evt.currentTarget as HTMLElement & { dataset: DOMStringMap };
                                (evt as Event & { columnName?: string; uniqueIndex?: number }).columnName = target.dataset.columnName;
                                (evt as Event & { columnName?: string; uniqueIndex?: number }).uniqueIndex = parseInt(target.dataset.uniqueIndex!);
                                ctrlHandler(evt as Event & { columnName?: string; uniqueIndex?: number });
                            });
                        }
                    }
                }

                if (loadData) {
                    self.setCtrlValue(y, uniqueIndex, (numOfRowOrRowArray as Record<string, unknown>[])[z][settings.columns[y].name]);
                } else if (!Util.isEmpty(settings.columns[y].value)) {
                    self.setCtrlValue(y, uniqueIndex, settings.columns[y].value);
                }

                if (!isCustom && typeof settings.columns[y].ctrlAdded === 'function') {
                    settings.columns[y].ctrlAdded!(ctrl!, tbCell as HTMLTableCellElement, uniqueIndex);
                }
            }

            tbCell = self.createElement('td', 'tbodyCell', settings.idPrefix + '_$rowButton_' + uniqueIndex);
            if (self.hideLastColumn || !settings.rowButtonsInFront) {
                tbRow.appendChild(tbCell);
            } else if (!settings.hideRowNumColumn) {
                tbRow.insertBefore(tbCell, tbRow.childNodes[1]);
            } else {
                tbRow.insertBefore(tbCell, tbRow.firstChild);
            }

            hiddenColumns.forEach(function (hi) {
                const hiddenName = settings.columns[hi].name;
                const hidCtrlId = settings.idPrefix + '_' + hiddenName + '_' + uniqueIndex;
                let hidCtrlName: string;
                if (typeof settings.nameFormatter === 'function') {
                    hidCtrlName = settings.nameFormatter(settings.idPrefix, hiddenName, uniqueIndex);
                } else {
                    hidCtrlName = hidCtrlId;
                }
                tbCell.appendChild(Util.createElem('input', hidCtrlId, hidCtrlName, null, 'hidden'));
                if (loadData) {
                    self.setCtrlValue(hi, uniqueIndex, (numOfRowOrRowArray as Record<string, unknown>[])[z][hiddenName]);
                } else if (!Util.isEmpty(settings.columns[hi].value)) {
                    self.setCtrlValue(hi, uniqueIndex, settings.columns[hi].value);
                }
            });

            if (self.hideLastColumn) {
                tbCell.style.display = 'none';
            } else if (settings.columns.length > self.visibleCount) {
                Util.applyClasses(tbCell, uiFramework.getSectionClasses('last'));
                let container = uiFramework.createButtonGroup();
                if (container) {
                    tbCell.appendChild(container);
                } else {
                    container = tbCell;
                }
                (['insert', 'remove', 'moveUp', 'moveDown'] as ButtonType[]).forEach(function (type) {
                    if (!settings.hideButtons[type]) {
                        const buttonId = settings.idPrefix + '_$' + type + '_' + uniqueIndex;
                        const button = uiFramework.generateButton(container!, type, buttonId);
                        (button as HTMLElement & { dataset: DOMStringMap }).dataset.uniqueIndex = String(uniqueIndex);
                        button.addEventListener('click', function (evt: Event) {
                            const callerIdx = parseInt((evt.currentTarget as HTMLElement & { dataset: DOMStringMap }).dataset.uniqueIndex!);
                            self.rowButtonActions(type, callerIdx);
                        });
                    }
                });
            }
        }

        self.saveSetting();

        if (!settings.hideRowNumColumn && !Util.isEmpty(rowIdx)) {
            self.sortSequence(rowIdx!);
        }

        if (Util.isNumeric(rowIdx)) {
            if (typeof settings.afterRowInserted === 'function') {
                settings.afterRowInserted(self.tbWhole, parentIndex, addedRows);
            }
        } else {
            if (typeof settings.afterRowAppended === 'function') {
                settings.afterRowAppended(self.tbWhole, parentIndex, addedRows);
            }
        }
        if (reachMaxRow && typeof settings.maxNumRowsReached === 'function') {
            settings.maxNumRowsReached(self.tbWhole);
        }

        return { addedRows, parentIndex, rowIndex: rowIdx };
    }

    removeRow(rowIndex?: number | null, uniqueIndex?: number | null, force?: boolean): void {
        const self = this;
        const settings = self.settings, tbBody = self.tbBody;
        let rowIdx: number | null = rowIndex ?? null;

        if (Util.isNumeric(uniqueIndex)) {
            for (let z = 0; z < self.rowOrder.length; z++) {
                if (self.rowOrder[z] === uniqueIndex) {
                    rowIdx = z;
                    break;
                }
            }
        }

        if (Util.isNumeric(rowIdx)) {
            if (force || typeof settings.beforeRowRemove !== 'function' || settings.beforeRowRemove(self.tbWhole, rowIdx!)) {
                self.rowOrder.splice(rowIdx!, 1);
                tbBody.removeChild(tbBody.childNodes[rowIdx!]);
                self.saveSetting();
                if (!settings.hideRowNumColumn) {
                    self.sortSequence(rowIdx!);
                }
                if (typeof settings.afterRowRemoved === 'function') {
                    settings.afterRowRemoved(self.tbWhole, rowIdx);
                }
            }
        } else {
            if (force || typeof settings.beforeRowRemove !== 'function' || settings.beforeRowRemove(self.tbWhole, self.rowOrder.length - 1)) {
                self.rowOrder.pop();
                tbBody.removeChild(tbBody.lastChild!);
                self.saveSetting();
                if (typeof settings.afterRowRemoved === 'function') {
                    settings.afterRowRemoved(self.tbWhole, null);
                }
            }
        }

        if (self.rowOrder.length === 0) {
            self.showEmptyMessage();
        }
    }

    moveUpRow(rowIndex?: number | null, uniqueIndex?: number | null): void {
        const self = this;
        const settings = self.settings, tbBody = self.tbBody;
        let oldIndex: number | null = null;
        let uid = uniqueIndex ?? null;

        if (Util.isNumeric(rowIndex) && rowIndex! > 0 && rowIndex! < self.rowOrder.length) {
            oldIndex = rowIndex!;
            uid = self.rowOrder[rowIndex!];
        } else if (Util.isNumeric(uid)) {
            oldIndex = self.findRowIndex(uid!);
        }

        if (!Util.isEmpty(oldIndex) && oldIndex! > 0) {
            const swapUniqueIndex = self.rowOrder[oldIndex! - 1];
            const trTarget = document.getElementById(settings.idPrefix + '_$row_' + uid)!;
            const trSwap = document.getElementById(settings.idPrefix + '_$row_' + swapUniqueIndex)!;
            tbBody.removeChild(trTarget);
            tbBody.insertBefore(trTarget, trSwap);
            self.rowOrder[oldIndex!] = swapUniqueIndex;
            self.rowOrder[oldIndex! - 1] = uid!;
            if (!settings.hideRowNumColumn) {
                const targetRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + uid)!;
                const swapRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + swapUniqueIndex)!;
                const swapSeq = swapRowNumCell.innerHTML;
                swapRowNumCell.innerHTML = targetRowNumCell.innerHTML;
                targetRowNumCell.innerHTML = swapSeq;
            }
            self.saveSetting();
            document.getElementById(settings.idPrefix + '_$moveUp_' + uid)?.blur();
            document.getElementById(settings.idPrefix + '_$moveUp_' + swapUniqueIndex)?.focus();
            if (typeof settings.afterRowSwapped === 'function') {
                settings.afterRowSwapped(self.tbWhole, oldIndex!, oldIndex! - 1);
            }
        }
    }

    moveDownRow(rowIndex?: number | null, uniqueIndex?: number | null): void {
        const self = this;
        const settings = self.settings, tbBody = self.tbBody;
        let oldIndex: number | null = null;
        let uid = uniqueIndex ?? null;

        if (Util.isNumeric(rowIndex) && rowIndex! >= 0 && rowIndex! < self.rowOrder.length - 1) {
            oldIndex = rowIndex!;
            uid = self.rowOrder[rowIndex!];
        } else if (Util.isNumeric(uid)) {
            oldIndex = self.findRowIndex(uid!);
        }

        if (!Util.isEmpty(oldIndex) && oldIndex !== self.rowOrder.length - 1) {
            const swapUniqueIndex = self.rowOrder[oldIndex! + 1];
            const trTarget = document.getElementById(settings.idPrefix + '_$row_' + uid)!;
            const trSwap = document.getElementById(settings.idPrefix + '_$row_' + swapUniqueIndex)!;
            tbBody.removeChild(trSwap);
            tbBody.insertBefore(trSwap, trTarget);
            self.rowOrder[oldIndex!] = swapUniqueIndex;
            self.rowOrder[oldIndex! + 1] = uid!;
            if (!settings.hideRowNumColumn) {
                const targetRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + uid)!;
                const swapRowNumCell = document.getElementById(settings.idPrefix + '_$rowNum_' + swapUniqueIndex)!;
                const swapSeq = swapRowNumCell.innerHTML;
                swapRowNumCell.innerHTML = targetRowNumCell.innerHTML;
                targetRowNumCell.innerHTML = swapSeq;
            }
            self.saveSetting();
            document.getElementById(settings.idPrefix + '_$moveDown_' + uid)?.blur();
            document.getElementById(settings.idPrefix + '_$moveDown_' + swapUniqueIndex)?.focus();
            if (typeof settings.afterRowSwapped === 'function') {
                settings.afterRowSwapped(self.tbWhole, oldIndex!, oldIndex! + 1);
            }
        }
    }

    setCtrlValue(colIndex: number, uniqueIndex: number, data: unknown): void {
        const self = this;
        const settings = self.settings;
        const type = settings.columns[colIndex].type;
        const columnName = settings.columns[colIndex].name;
        if (type === 'custom') {
            if (typeof settings.columns[colIndex].customSetter === 'function') {
                settings.columns[colIndex].customSetter!(settings.idPrefix, columnName, uniqueIndex, data);
            }
        } else {
            const element = self.getCellCtrl(settings.idPrefix, columnName, uniqueIndex);
            if (element) {
                if (type === 'checkbox') {
                    if (typeof data === 'boolean') {
                        (element as HTMLInputElement).checked = data;
                    } else if (Util.isNumeric(data)) {
                        (element as HTMLInputElement).checked = data !== 0;
                    } else {
                        (element as HTMLInputElement).checked = !Util.isEmpty(data);
                    }
                } else {
                    (element as HTMLInputElement).value = Util.isEmpty(data) ? '' : String(data);
                }
            }
        }
    }

    getCellCtrl(idPrefix: string, columnName: string, uniqueIndex: number): HTMLElement | null {
        return document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex);
    }

    getCtrlValue(colIndex: number, uniqueIndex: number): unknown {
        const self = this;
        const settings = self.settings;
        const column: ColumnOption = settings.columns[colIndex];
        if (column.type === 'custom') {
            if (typeof column.customGetter === 'function') {
                return column.customGetter(settings.idPrefix, column.name, uniqueIndex);
            } else {
                throw `*customGetter* of column *${column.name}* is not defined.`;
            }
        } else {
            const ctrl = self.getCellCtrl(settings.idPrefix, column.name, uniqueIndex);
            if (ctrl === null) {
                return null;
            } else if (column.type === 'checkbox') {
                return (ctrl as HTMLInputElement).checked ? 1 : 0;
            } else {
                return (ctrl as HTMLInputElement).value;
            }
        }
    }

    getRowValue(uniqueIndex: number, loopIndex?: number): Record<string, unknown> {
        const self = this;
        const result: Record<string, unknown> = {};
        const suffix = Util.isEmpty(loopIndex) ? '' : '_' + loopIndex;
        self.settings.columns.forEach(function (column, colIndex) {
            const keyName = column.name + suffix;
            result[keyName] = self.getCtrlValue(colIndex, uniqueIndex);
        });
        return result;
    }

    getColumnIndex(name: string): number | null {
        const columns = this.settings.columns;
        for (let c = 0; c < columns.length; c++) {
            if (columns[c].name === name) {
                return c;
            }
        }
        return null;
    }

    isRowEmpty(uniqueIndex: number): boolean {
        const self = this;
        const columns = self.settings.columns;
        for (let c = 0; c < columns.length; c++) {
            const emptyCriteria = columns[c].emptyCriteria;
            const currentValue = self.getCtrlValue(c, uniqueIndex);
            if (typeof emptyCriteria === 'function') {
                if (!emptyCriteria(currentValue)) {
                    return false;
                }
            } else {
                let defaultValue: unknown = null;
                if (!Util.isEmpty(emptyCriteria)) {
                    defaultValue = emptyCriteria;
                } else {
                    const colType = columns[c].type;
                    if (colType === 'checkbox') {
                        defaultValue = 0;
                    } else if (colType === 'select') {
                        const selectCtrl = self.getCellCtrl(self.settings.idPrefix, columns[c].name, uniqueIndex) as HTMLSelectElement | null;
                        if (selectCtrl && selectCtrl.options.length > 0) {
                            defaultValue = selectCtrl.options[0].value;
                        } else {
                            defaultValue = '';
                        }
                    } else {
                        defaultValue = '';
                    }
                }
                if (currentValue !== defaultValue) {
                    return false;
                }
            }
        }
        return true;
    }

    findRowIndex(uniqueIndex: number): number | null {
        for (let z = 0; z < this.rowOrder.length; z++) {
            if (this.rowOrder[z] === uniqueIndex) {
                return z;
            }
        }
        return null;
    }

    private saveSetting(): void {
        const self = this;
        (document.getElementById(self.settings.idPrefix + '_rowOrder') as HTMLInputElement).value = self.rowOrder.join();
    }

    showEmptyMessage(): void {
        const self = this;
        self.tbBody.innerHTML = '';
        const tbRow = self.createElement('tr', 'tbodyRow');
        self.tbBody.appendChild(tbRow);
        const tbCell = self.createElement('td', 'tbodyCell');
        tbCell.setAttribute('colspan', String(self.finalColSpan));
        Util.applyClasses(tbCell, self.uiFramework.getSectionClasses('empty'));
        tbCell.innerText = self.settings.i18n.rowEmpty;
        tbRow.appendChild(tbCell);
    }

    sortSequence(startIndex: number): void {
        const self = this;
        for (let z = startIndex || 0; z < self.rowOrder.length; z++) {
            document.getElementById(self.settings.idPrefix + '_$rowNum_' + self.rowOrder[z])!.innerText = String(z + 1);
        }
    }

    rowButtonActions(type: ButtonType, uniqueIndex: number): void {
        const self = this;
        if (type === 'insert') {
            self.insertRow(1, null, uniqueIndex);
        } else if (type === 'remove') {
            self.removeRow(null, uniqueIndex);
        } else if (type === 'moveUp') {
            self.moveUpRow(null, uniqueIndex);
        } else if (type === 'moveDown') {
            self.moveDownRow(null, uniqueIndex);
        }
    }
}

export default GridCore;
