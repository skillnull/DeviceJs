import type { VariableLibrary } from '../../data/variable-library';
import type { DeviceLocale } from '../../types';
export declare function createBrowserMethods(VariableLibrary: VariableLibrary, runtimeScope: any): {
    getBrowserInfo: (locale?: DeviceLocale) => string;
    createFingerprint: (domain: any) => any;
};
