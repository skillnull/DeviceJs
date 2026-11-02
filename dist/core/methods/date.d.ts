import type { VariableLibrary } from '../../data/variable-library';
import type { DeviceLocale } from '../../types';
export declare function createDateMethods(VariableLibrary: VariableLibrary): {
    getDate: () => string;
    getWeek: (locale?: DeviceLocale) => "周日" | "周一" | "周二" | "周三" | "周四" | "周五" | "周六" | "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    toLunarDate: (date: any) => {
        year: string;
        month: string;
        day: string;
        chineseZodiac: any;
    };
};
