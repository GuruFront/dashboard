/// <reference path="datasources/WorkCompletedDataSource.ts" />
abstract class Widget {
    public readonly id: number;
    public readonly config: IWidgetConfiguration;

    public isInEditMode: boolean;

    abstract init(element: HTMLInputElement);

    protected dataSource: DataSource;

    protected constructor(config: IWidgetConfiguration) {
        this.config = config;
        this.id = Math.random();

        this.subscribeToDateChangedEvent();
    }

    private subscribeToDateChangedEvent() {
        if (this.config.isTimeDependant) {
            document.addEventListener('date_changed', (ev: CustomEvent) => {
                const newDate = ev.detail.date as Date;
                const idToday = ev.detail.isToday as boolean;
                this.handleDateChange(newDate, idToday);
            }, false);
        }
    }

    protected handleDateChange(newDate: Date, isToday: boolean) { }


    protected hideSpinner(element: HTMLElement) {
        const spinner = element.getElementsByClassName("widget-loading-container")[0] as HTMLElement;
        spinner.style.display = 'none';
    }

    // public toVueGridModel(): IVueGridModel {
    //     let result: IVueGridModel = {
    //         i: this.id,
    //         x: this.config.x,
    //         y: this.config.y,
    //         w: this.config.width,
    //         h: this.config.height,
    //         isResizable: this.config.isResizable,
    //         minH: this.config.minHeight,
    //         maxH: this.config.maxHeight,
    //         minW: this.config.minWidth,
    //         maxW: this.config.maxWidth
    //     };

    //     return result;
    // }

    protected getDataSourceId(): string { return null; }

    private static _dataSources: { [key: string]: DataSource } = {
        [WorkCompletedDataSource.id]: new WorkCompletedDataSource()
    };

    static widgetInitializer(options: IWidgetOptions) {
        let widget: Widget;

        switch (options.id) {
            case ImageWidget.id:
                widget = new ImageWidget(options);
                break;
            case ClockWidget.id:
                widget = new ClockWidget(options);
                break;
            case WorkCountByActivityAndStatusWidget.id:
                widget = new WorkCountByActivityAndStatusWidget(options as IWorkCountByActivityAndStatusWidgetOptions);
                break;
            default:
                return null;
        }

        if (widget) {
            let dataSourceId = widget.getDataSourceId();
            if (dataSourceId) {
                widget.dataSource = Widget._dataSources[dataSourceId];
            }
        }
        return widget;
    }

}