interface IWidgetConfiguration {
    readonly minWidth?: number;
    readonly maxWidth?: number;
    readonly width: number;

    readonly minHeight?: number;
    readonly maxHeight?: number;
    readonly height: number;

    x: number;
    y: number;

    isConfigurable: boolean;
    isResizable: boolean;
    isRemovable: boolean;

    isTimeDependant: boolean;

    title: string;
}