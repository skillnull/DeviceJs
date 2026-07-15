import type { VariableLibrary } from '../../data/variable-library';
export declare function createDateMethods(VariableLibrary: VariableLibrary): {
    getDate: () => string;
    getWeek: () => string;
    toLunarDate: (date: any) => {
        year: string;
        month: string;
        day: string;
        chineseZodiac: any;
    };
};
