import type { DeviceInfoOptions } from '../types';
import type { MethodLibrary } from '../core/method-library';
import type { VariableLibrary } from '../data/variable-library';
interface CreateLogicLibraryOptions {
    MethodLibrary: MethodLibrary;
    VariableLibrary: VariableLibrary;
    windowScope: any;
}
export declare function createLogicLibrary({ MethodLibrary, VariableLibrary, windowScope: _window }: CreateLogicLibraryOptions): {
    DeviceInfoObj(params?: DeviceInfoOptions): Promise<Record<string, any>>;
};
export type LogicLibrary = ReturnType<typeof createLogicLibrary>;
export {};
