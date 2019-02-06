interface IWidgetConfiguration {
    readonly minWidth?: number;
    readonly maxWidth?: number;

    readonly minHeight?: number;
    readonly maxHeight?: number;

    readonly isConfigurable: boolean;
    
    readonly isRemovable: boolean;

    readonly isTimeDependant: boolean;

    readonly maxInstanceCount?: number;
}