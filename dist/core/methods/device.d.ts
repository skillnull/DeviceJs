import type { VariableLibrary } from '../../data/variable-library';
import type { DeviceLocale } from '../../types';
export declare function createDeviceMethods(VariableLibrary: VariableLibrary, runtimeScope: any): {
    getOrientationStatus: (locale?: DeviceLocale) => "未知" | "竖屏" | "横屏" | "Unknown" | "Portrait" | "Landscape";
    getDeviceType: () => any;
    getIsEmulator(): boolean;
    getDeviceModel(): any;
};
