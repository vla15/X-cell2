const removeChildren = function(parentEl) {
	if (parentEl.firstChild) {
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