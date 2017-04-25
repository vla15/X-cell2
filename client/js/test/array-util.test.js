const { getRange, getLetterRange } = require('../array_util.js');

describe('array util', () => {

	describe('getRange()', () => {
		it('produces a valid range starting with 0', () => {
			expect(getRange(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		});

		it('produces a valid range starting from 1', () => {
			expect(getRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
		});

		it('produces a valid range with negatives', () => {
			expect(getRange(-10, -7)).toEqual([-10, -9, -8, -7]);
		});
	})


	describe('getLetterRange()', () => {
		it('produces a single letter range', () => {
			expect(getLetterRange('B', 1)).toEqual(['B']);
		});

		it('produces a valid letter range starting from A', () => {
			expect(getLetterRange('A', 5)).toEqual(['A', 'B', 'C', 'D', 'E']);
		});

		it('produces a valid letter range starting from B', () => {
			expect(getLetterRange('B', 5)).toEqual(['B', 'C', 'D', 'E', 'F']);
		});
	})
})

