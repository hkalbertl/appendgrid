import { assert } from 'vitest'
import AppendGrid from '../src/index.ts'

describe('AppendGrid PlainJS', function () {
    let grid: AppendGrid;

    beforeAll(function () {
        var domTable = document.createElement('table');
        domTable.id = 'tblAppendGrid';
        document.body.appendChild(domTable);
        document.body.className = 'container';

        grid = new AppendGrid({
            element: domTable,
            uiFramework: 'default',
            iconFramework: 'default',
            columns: [
                { name: 'foo', display: 'Foo', type: 'text' },
                { name: 'bar', display: 'Bar', type: 'text' }
            ],
            initRows: 5
        });
    });

    describe('#init', function () {
        it('should initialized', function () {
            assert.isOk(grid);
        });

        it('should have 5 rows', function () {
            assert.deepEqual(grid.getRowOrder(), [1, 2, 3, 4, 5]);
        });
    });

    describe('#appendRow', function () {
        it('should have 7 rows', function () {
            grid.appendRow(2);
            assert.deepEqual(grid.getRowOrder(), [1, 2, 3, 4, 5, 6, 7]);
        });
    });
});
