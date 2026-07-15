import type { VariableLibrary } from '../../data/variable-library';
export declare function createDeviceMethods(VariableLibrary: VariableLibrary): {
    getOrientationStatu: () => string;
    getDeviceType: () => any;
    getIsEmulator(): boolean;
    getDeviceModel(): any;
};
