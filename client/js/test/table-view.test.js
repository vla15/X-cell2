const TableView = require('../table-view');
const TableModel = require('../table-model');
const fs = require('fs');


describe('table view', () => {
	beforeEach(() => {
		const fixturePath = './client/js/test/fixtures/sheet-container.html';
		const html = fs.readFileSync(fixturePath, 'utf8');

		document.documentElement.innerHTML = html;
	});

	describe('sum row bar,', () => {
		it('sums the entire col', () => {
			const model = new TableModel(3 ,3);
			const view = new TableView(model);
			model.setValue({col: 0, row: 1}, 10);
			model.setValue({col: 0, row: 2}, 5);
			view.init();

			let trs = document.querySelectorAll('.sum-row')
			expect(trs[0].cells[0].textContent).toBe('15');
		})
	})

	describe('formula bar', () => {

		it('makes changes to the value of the current cell', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);

			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[0].cells[0];
			expect(td.textContent).toBe('');
			
			document.querySelector('#formula-bar').value = '65'
			view.handleFormulaBarChange();

			trs = document.querySelectorAll('TBODY TR')
			expect(trs[0].cells[0].textContent).toBe('65');
		});



		it('updates from the value of the current cell', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);

			model.setValue({col: 2, row: 1}, '123');
			view.init();

			const formulaBarEl = document.querySelector('#formula-bar');
			expect(formulaBarEl.value).toBe('');

			const trs = document.querySelectorAll('TBODY TR');
			trs[1].cells[2].click();

			expect(formulaBarEl.value).toBe('123');
		});
	});

	describe('table body', () => {
		it ('highlights the current cell when clicked', () => {
			
			const model = new TableModel(10, 5);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[2].cells[1];
			expect(td.className).toBe('');

			td.click();

			trs = document.querySelectorAll('TBODY TR');
			td = trs[2].cells[1];
			expect(td.className).not.toBe('');
		});

		it('has the right size', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH')
			expect(ths.length).toBe(numCols);
		});

		it('fills in values from the model', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 2, row: 1}, '123');
			//model.setValue({col: 1, row: 1}, '123');
			view.init();

			//expect(model.getValue({col: 2, row: 1})).toBe('123');

			const trs = document.querySelectorAll('TBODY TR');
			expect(trs[1].cells[2].textContent).toBe('123');
		});
	});

	describe('table header', () => {
		it('has valid column labels', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model)
			view.init();

			let ths = document.querySelectorAll('THEAD TH')
			expect(ths.length).toBe(numCols);

			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
		});
	});
});