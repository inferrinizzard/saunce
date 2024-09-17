// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
let passiveSupported = false;
try {
	const options = {
		get passive() {
			passiveSupported = true;
			return true;
		},
	};
	window.addEventListener('test' as keyof WindowEventMap, options as any, options);
	window.removeEventListener('test' as keyof WindowEventMap, options as any, options as any);
} catch {
	passiveSupported = false;
}

function makePassiveEventOption(passive: boolean) {
	return passiveSupported ? { passive } : {};
}

export default makePassiveEventOption;
