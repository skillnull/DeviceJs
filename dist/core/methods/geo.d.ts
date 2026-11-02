import type { GeoPositionResult } from '../../types/internal';
import type { VariableLibrary } from '../../data/variable-library';
export declare function createGeoMethods(VariableLibrary: VariableLibrary): {
    getGeoPosition: () => Promise<GeoPositionResult | null>;
};
