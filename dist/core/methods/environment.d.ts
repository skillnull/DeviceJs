import type { VariableLibrary } from '../../data/variable-library';
export declare function createEnvironmentMethods(VariableLibrary: VariableLibrary): {
    getColorScheme: () => "" | "dark" | "light";
    getDevicePixelRatio: () => number;
    getHardwareConcurrency: () => any;
    getTouchSupport: () => boolean;
    getCookieEnabled: () => any;
    getTimezone: () => string;
    getNetwork: () => string;
    getLanguage: () => any;
};
