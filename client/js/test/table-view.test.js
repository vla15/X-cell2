const TableView = require('../table-view');
const TableModel = require('../table-model');
const fs = require('fs');


describe('table view', () => {
  beforeEach(() => {
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('add col button', () => {
    it('adds another column after the last column when clicked', () => {
      const numRows = 5;
      const numCols = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      view.addCol();
      ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols + 1);      
      expect(ths[10].textContent).toEqual('K');
    })
  })

  describe('add row button', () => {
    it('adds another row to the bottom of the table body but before the sum-row when clicked', () => {
      const model = new TableModel(3, 3);
      let view = new TableView(model);
      view.init();
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[3];
      expect(td.getAttribute('class')).toBe('sum-row');

      view.addRow();
      trs = document.querySelectorAll('TBODY TR');
      td = trs[3];
      expect(td.getAttribute('class')).not.toBe('sum-row');

      td = trs[4];
      expect(td.getAttribute('class')).toBe('sum-row');
    })
  })

  describe('sum row bar,', () => {
    it('sums the entire col', () => {
      const model = new TableModel(3 ,3);
      const view = new TableView(model);
      model.setValue({col: 0, row: 1}, 10);
      model.setValue({col: 0, row: 2}, 5);
      view.init();
      let trs = document.querySelectorAll('.sum-row');
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
      view.init();
      const trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');
    });
  });

  describe('table header', () => {
    it('has valid column labels', () => {
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      let labelTexts = Array.from(ths).map(el => el.textContent);
      expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    });
  });
});