import type { VariableLibrary } from '../../data/variable-library';
export declare function createEnvironmentMethods(VariableLibrary: VariableLibrary): {
    getNetwork: () => string;
    getLanguage: () => any;
};
