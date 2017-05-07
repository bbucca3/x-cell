const { getLetterRange } = require('./array-util');
const { removeChildren, createTR, createTH, createTD } = require('./dom-util');

class TableView {

    constructor(model) {
        this.model = model;
    }

    init() {
        this.initDomReferences();
        this.initCurrentCell();
        this.renderTable();
        this.attachEventHandlers();
    }

    initDomReferences() {
        this.headerRowEl = document.querySelector('THEAD TR');
        this.footerRowEl = document.querySelector('TFOOT TR');
        this.sheetBodyEl = document.querySelector('TBODY');
        this.formulaBarEl = document.querySelector('#formula-bar');
    }

    initCurrentCell() {
        this.currentCellLocation = { col: 0, row: 0 };
        this.renderFormulaBar();
    }

    normalizeValueForRendering(value) {
        return value || '';
    }

    renderFormulaBar() {
        const currentCellValue = this.model.getValue(this.currentCellLocation);
        this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
        this.formulaBarEl.focus();
    }

    renderTable() {
        this.renderTableHeader();
        this.renderTableBody();
        this.renderTableFooter();
    }

    renderTableHeader() {
        // clear header row
        removeChildren(this.headerRowEl);
        // get letters and build elements
        getLetterRange('A', this.model.numCols)
            .map(columnLabel => createTH(columnLabel))
            .forEach(th => this.headerRowEl.appendChild(th));
    }

    isCurrentCell(col, row) {
        return this.currentCellLocation.col === col &&
                this.currentCellLocation.row === row;
    }

    renderTableBody() {
        const fragment = document.createDocumentFragment();
        for (let row = 0; row < this.model.numRows; row++) {
            const tr = createTR();
            for (let col = 0; col < this.model.numCols; col++) {
                const position = {col: col, row: row};
                const value = this.model.getValue(position);
                const td = createTD(value);

                if (this.isCurrentCell(col, row)) {
                    td.className = 'current-cell';
                }

                tr.appendChild(td);
            }
            fragment.appendChild(tr);
        }
        removeChildren(this.sheetBodyEl);
        this.sheetBodyEl.appendChild(fragment);
    }

    renderTableFooter() {
        const tfootFragment = document.createDocumentFragment();
            // create data cells for row based on number of columns
            for (let col = 0; col < this.model.numCols; col++) {
                // get total sum for each column
                const sum = this.sumColumnTotal(col)
                const td = createTD(sum);
                tfootFragment.appendChild(td); 
            }
        removeChildren(this.footerRowEl);
        // add footer to table
        this.footerRowEl.appendChild(tfootFragment);
    }

    attachEventHandlers() {
        this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
        this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
    }

    handleFormulaBarChange(evt) {
        const value = this.formulaBarEl.value;
        this.model.setValue(this.currentCellLocation, value);
        this.renderTableBody();
        this.renderTableFooter();
    }

    handleSheetClick(evt) {
        const col = evt.target.cellIndex;
        const row = evt.target.parentElement.rowIndex - 1;

        this.currentCellLocation = { col: col, row: row };
        this.renderTableBody();
        this.renderFormulaBar();
        this.renderTableFooter();
    }

    sumColumnTotal(col) {
        var total = 0;
        // loop through each row
        for(let row = 0; row < this.model.numRows; row++) {
            // account for values in row and check for non-number values
            if(this.model.getValue({col: col, row: row}) !== undefined && 
                !isNaN(this.model.getValue({col: col, row: row}))) {
                // sum total
                total += parseInt(this.model.getValue({col: col, row: row}));
                
            }
        }
        return total;
    }


}

module.exports = TableView;