interface IWidgetOptions {
    isResizable?: boolean;
    isConfigurable?: boolean;
    isRemovable?: boolean;
    title?: string;


    x: number;
    y: number;

    minWidth: number;
    minHeight: number;

    width: number;
    height: number;

    id: string;
}