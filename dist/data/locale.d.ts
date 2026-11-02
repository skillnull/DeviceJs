import type { DeviceLocale } from '../types';
export declare function getLocaleMessages(locale?: DeviceLocale): {
    readonly unknown: "未知";
    readonly unavailable: "获取失败";
    readonly offline: "离线";
    readonly portrait: "竖屏";
    readonly landscape: "横屏";
    readonly longitude: "经度";
    readonly latitude: "纬度";
    readonly version: "版本";
    readonly engine: "内核";
    readonly weekdays: readonly ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
} | {
    readonly unknown: "Unknown";
    readonly unavailable: "Unavailable";
    readonly offline: "Offline";
    readonly portrait: "Portrait";
    readonly landscape: "Landscape";
    readonly longitude: "Longitude";
    readonly latitude: "Latitude";
    readonly version: "version";
    readonly engine: "engine";
    readonly weekdays: readonly ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
};
