import type { VariableLibrary } from '../../data/variable-library';
export declare function createBrowserMethods(VariableLibrary: VariableLibrary, _window: any): {
    getBrowserInfo: () => string;
    createFingerprint: (domain: any) => any;
};
