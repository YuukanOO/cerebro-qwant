// All credits goes to https://davidwalsh.name/javascript-debounce-function
export default function debounce (func, wait, immediate) {
	var timeout;
	return () => {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};