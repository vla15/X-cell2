const getRange = function(fromNum, toNum) {
	return Array.from( { length: toNum - fromNum + 1}, 
		(unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = 'A', numLetters) {
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters - 1;
	return getRange(rangeStart, rangeEnd).map(charCode => String.fromCharCode(charCode));
};

const getSum = function(...numbers) {
	if (typeof numbers !== undefined && numbers.length > 0) {
		return numbers.reduce((num1, num2) => {
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