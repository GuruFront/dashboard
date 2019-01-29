/// <reference path="../Widget.ts" />
class WorkCountByActivityAndStatusWidget extends Widget {
    public static readonly id = "workCountByActivityAndStatusWidget";
    public static readonly dataSourceId = "workCompetedDataSource";

    private readonly activityTypeId: number;
    private readonly workStatusId: number;

    private counterElement: HTMLElement;    

    constructor(options: IWorkCountByActivityAndStatusWidgetOptions) {

        const config: IWidgetConfiguration = {
            isConfigurable: false,
            isResizable: typeof options.isResizable !== "undefined" ? options.isResizable : true,
            isRemovable:  typeof options.isRemovable !== "undefined" ? options.isRemovable : true,
            title: options.title || "Work Counter",
            width: options.width || 2,
            height: options.height || 2,
            minHeight: 1,
            maxHeight: 3,
            minWidth: 1,
            maxWidth: 3,
            x: options.x,
            y: options.y,
            isTimeDependant: true
        };

        super(config);

        this.activityTypeId = options.activityTypeId;
        this.workStatusId = options.workStatusId;
    }

    init(element: HTMLElement) {
        element.classList.add("work-count-widget");
        
        this.createTitleElement(element);
        this.counterElement = this.createCounterElement(element);

        if (!this.dataSource) {
            throw new Error('DataSource is null');
        }

        this.dataSource.getData()
            .then(data => {
                this.hideSpinner(element); 

                this.counterElement.innerText = data.toString();
            });        
    }

    private createTitleElement(element: HTMLInputElement) {
        const p = document.createElement('div');
        p.className = 'title';
        p.innerText = this.config.title;
        element.appendChild(p);
    }

    private createCounterElement(element: HTMLElement) {
        const el = document.createElement('div');
        el.className = 'counter';
        el.innerHTML = '&nbsp;';
        element.appendChild(el);

        return el;
    }

    protected getDataSourceId() {
        return WorkCompletedDataSource.id;
    }
}

interface IWorkCountByActivityAndStatusWidgetOptions extends IWidgetOptions {
    activityTypeId: number;
    workStatusId: number;
}