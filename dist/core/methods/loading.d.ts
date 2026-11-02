export declare function createLoadingMethods(runtimeScope: any): {
    createLoading: (text?: string, showTimeCount?: boolean) => HTMLDivElement;
    /**
     * 删除loading
     */
    removeLoading: (loadingElement?: HTMLElement) => void;
};
