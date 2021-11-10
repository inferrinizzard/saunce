// Type definitions for google-translate-api 2.3
// Project: https://github.com/matheuss/google-translate-api#readme
// Definitions by: maple3142 <https://github.com/maple3142>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface TranslateOption {
	from?: string | undefined;
	to?: string | undefined;
	raw?: boolean | undefined;
}
export interface TranslateResult {
	text: string;
	from: {
		language: {
			didYouMean: boolean;
			iso: string;
		};
		text: {
			autoCorrected: boolean;
			value: string;
			didYouMean: boolean;
		};
	};
	raw: string;
}
export type translate = (text: string, options?: TranslateOption) => Promise<TranslateResult>;