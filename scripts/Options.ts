interface ISizeOptions {
    width: number;
    height: number;
}

interface IPositionOptions {
    x: number;
    y: number;
}

interface IOptions<T> extends ISizeOptions, IPositionOptions {
    options: T;
}

interface ISideBarSettings {
    defaultWidth: number;
    defaultHeight: number;

    title: string;
    description: string;
    icon: string;
    category: string;
    maxCount: number;
}