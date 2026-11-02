import type { VariableLibrary } from '../../data/variable-library';
import type { DeviceLocale } from '../../types';
export declare function createEnvironmentMethods(VariableLibrary: VariableLibrary, runtimeScope: any): {
    getColorScheme: () => "" | "dark" | "light";
    getDevicePixelRatio: () => any;
    getHardwareConcurrency: () => any;
    getTouchSupport: () => boolean;
    getCookieEnabled: () => any;
    getTimezone: () => string;
    getNetwork: (locale?: DeviceLocale) => string;
    getLanguage: () => any;
};
