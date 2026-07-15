import type { VariableLibrary } from '../../data/variable-library';
export declare function createOsMethods(VariableLibrary: VariableLibrary): {
    getOS: () => any;
    getOSVersion: () => any;
    getPlatform(): any;
};
