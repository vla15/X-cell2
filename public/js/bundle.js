(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();
},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){
const getRange = function(fromNum, toNum) {
	return Array.from( { length: toNum - fromNum + 1}, 
		(unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = 'A', numLetters) {
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters - 1;
	return getRange(rangeStart, rangeEnd).map(charCode => String.fromCharCode(charCode));
};

const getSum = function(numbers) {
	if (typeof numbers !== undefined && numbers.length > 0) {
		return numbers.reduce(function (num1, num2) {
			return num1 + num2;
		},0)
	} else {
		return numbers;
	}
}



module.exports = {
	getRange: getRange,
	getLetterRange: getLetterRange,
	getSum: getSum
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl) {
	while (parentEl.firstChild) {
		parentEl.removeChild(parentEl.firstChild);
	}
};


const createEl = function(tagName) {
	return function(text) {
		const el = document.createElement(tagName);
		if (text) {
			el.textContent = text;
		}
		return el;
	}
}

const createTH = createEl('TH');
const createTR = createEl('TR');
const createTD = createEl('TD');


module.exports = {
	createTH: createTH,
	createTD: createTD,
	createTR: createTR,
	removeChildren: removeChildren
}
},{}],4:[function(require,module,exports){
class TableModel {
	constructor(numCols=10, numRows=20) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}

	_getCellId(location) {
		return `${location.col}:${location.row}`;
	}

	getValue(location) {
		return this.data[this._getCellId(location)];
	}

	setValue(location, value) {
		return this.data[this._getCellId(location)] = value;
	}
}

module.exports = TableModel;
},{}],5:[function(require,module,exports){
const { getLetterRange, getSum } = require('./array_util');
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
		this.sheetBodyEl = document.querySelector('TBODY');
		this.formulaBarEl = document.querySelector('#formula-bar');
		this.addRowEl = document.querySelector('#add-row');
		this.addColEl = document.querySelector('#add-col');
		this.sumRowEl = document.querySelector('.sum-row');
		console.log(this.addRowEl);
	}

	initCurrentCell() {
		this.currentCellLocation = {col: 0, row: 0 };
		this.renderFormulaBar();
	}

	normalizeValueforRendering(value) {
		return value || '';
	}

	renderFormulaBar() {
		const currentCellValue = this.model.getValue(this.currentCellLocation);
		this.formulaBarEl.value = this.normalizeValueforRendering(currentCellValue);
		this.formulaBarEl.focus();
	}

	renderTable() {
		this.renderTableHeader();
		this.renderTableBody();
		this.renderSumRow();
	}

	addRow(event) {
		event.preventDefault();
		this.model.numRows++;
		this.renderTable();
	}

	addCol(event) {
		event.preventDefault();
		this.model.numCols++
		this.renderTable();
	}

	renderSumRow() {
		const fragment = document.createDocumentFragment();
		const tr = createTR();
		tr.setAttribute('class', 'sum-row');
		for (let col = 0; col < this.model.numCols; col++) {
			let colNumbers = [];
			for (let row = 0; row < this.model.numRows; row++) {
				const position = {col: col, row: row};
				const value = this.model.getValue(position);
				if (!isNaN(value)) {
					colNumbers.push(parseInt(value, 10));
				}
			}
			colNumbers = colNumbers.filter(num => !isNaN(num))
			const total = getSum(colNumbers).toString();

			const td = createTD(total);
			tr.appendChild(td);
		}
		fragment.appendChild(tr);
		this.sheetBodyEl.appendChild(fragment);
	}

	renderTableHeader() {
		removeChildren(this.headerRowEl);
		getLetterRange('A', this.model.numCols)
		.map(colLabel => createTH(colLabel))
		.forEach(th => this.headerRowEl.appendChild(th))
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
				const value = this.model.getValue(position)
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

	attachEventHandlers() {
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
		this.addRowEl.addEventListener('submit', this.addRow.bind(this));
		this.addColEl.addEventListener('submit', this.addCol.bind(this));
	}


	handleFormulaBarChange(evt) {
		const value = this.formulaBarEl.value;
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
		this.renderSumRow();
	}

	handleSheetClick(evt) {
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex - 1;


		this.currentCellLocation = { col: col, row: row }
		this.renderTableBody();
		this.renderFormulaBar();
		this.renderSumRow();
	}
}

module.exports = TableView;
},{"./array_util":2,"./dom-util":3}]},{},[1]);
