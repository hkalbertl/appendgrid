import { assert } from 'vitest'
import AppendGrid from '../src/index.ts'

interface GridConfig {
    id: string;
    sizing: string | null;
    grid: AppendGrid | null;
}

interface GridData {
    uiFramework: string;
    iconFramework: string;
    list: GridConfig[];
}

describe('AppendGrid Bootstrap5', function () {
    let gridData: GridData;

    beforeAll(function () {
        gridData = {
            uiFramework: 'bootstrap5',
            iconFramework: 'fontawesome6',
            list: [
                { id: 'tblAppendGrid', sizing: null, grid: null },
                { id: 'tbNormal', sizing: 'normal', grid: null },
                { id: 'tbSmall', sizing: 'small', grid: null },
                { id: 'tbLarge', sizing: 'large', grid: null }
            ]
        };
        gridData.list.forEach(function (gridConfig) {
            var domTable = document.createElement('table');
            domTable.id = gridConfig.id;
            document.body.appendChild(domTable);
        });
        document.body.className = 'container';
    });

    describe('#init', function () {
        it('should initialized', function () {
            gridData.list[0].grid = new AppendGrid({
                element: gridData.list[0].id,
                uiFramework: gridData.uiFramework,
                iconFramework: gridData.iconFramework,
                columns: [
                    { name: 'foo', display: 'Foo', type: 'text' },
                    { name: 'bar', display: 'Bar', type: 'text' }
                ],
                initRows: 5
            });
            assert.isOk(gridData.list[0].grid);
        });

        it('should have 5 rows', function () {
            assert.deepEqual(gridData.list[0].grid!.getRowOrder(), [1, 2, 3, 4, 5]);
        });
    });

    describe('#appendRow', function () {
        it('should have 7 rows', function () {
            const appendResult: number[] = gridData.list[0].grid!.appendRow(2);
            assert.deepEqual(appendResult, [6, 7]);
            assert.deepEqual(gridData.list[0].grid!.getRowOrder(), [1, 2, 3, 4, 5, 6, 7]);
        });
    });

    describe('#removeRow', function () {
        it('should have 6 rows', function () {
            gridData.list[0].grid!.removeRow(3);
            assert.deepEqual(gridData.list[0].grid!.getRowOrder(), [1, 2, 3, 5, 6, 7]);
        });
    });

    describe('#insertRow', function () {
        it('should have 8 rows', function () {
            const insertResult: number[] = gridData.list[0].grid!.insertRow([
                { "foo": "3A", "bar": "2019-03-03" },
                { "foo": "4A", "bar": "2019-04-04" }
            ], 3);
            assert.deepEqual(insertResult, [8, 9]);
            assert.deepEqual(gridData.list[0].grid!.getRowOrder(), [1, 2, 3, 8, 9, 5, 6, 7]);
            assert.deepEqual(gridData.list[0].grid!.getRowValue(3), { "foo": "3A", "bar": "2019-03-03" });
        });
    });
});
