const removeChildren = function(parentEl) {
	while (parentEL.firstChild) {
		parentEL.removeChild(parentEL.firstChild);
	}
};

const createEl = function(tagName) {
	return function(text) {
		const el = document.createElement(tagName);
		if (text) {
			el.textContent = text;
		}
		return el;
	};
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
	createTD: createTD,
	createTH: createTH,
	createTR: createTR,
	removeChildren: removeChildren
};