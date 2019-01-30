interface IWidgetConfiguration {
    readonly minWidth?: number;
    readonly maxWidth?: number;
    width: number;

    readonly minHeight?: number;
    readonly maxHeight?: number;
    height: number;

    x: number;
    y: number;

    readonly isConfigurable: boolean;
    readonly isResizable: boolean;
    readonly isRemovable: boolean;

    readonly isTimeDependant: boolean;

    title: string;

    readonly id: string;
}