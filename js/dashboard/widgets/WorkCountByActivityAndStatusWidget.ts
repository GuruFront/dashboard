/// <reference path="../Widget.ts" />
class WorkCountByActivityAndStatusWidget extends Widget<IWorkCountByActivityAndStatusWidgetOptions> {
    public static readonly id: string = "workCountByActivityAndStatusWidget";

    private counterElement: HTMLElement;

    private dataSource: DataSource;

    public static sidebarSettings: ISideBarSettings = {
        title: 'Work Counter',
        description: 'Work Counter widget. Removable. Not configurable. Resizable. Movable. 2*2. 2 instances max',
        category: 'Work',
        icon: 'fas fa-info-circle',
        defaultWidth: 2,
        defaultHeight: 2,
        maxCount: 2,
        isResizable: true,
        isMovable: true,
    };

    constructor(clientId: number, options: IOptions<IWorkCountByActivityAndStatusWidgetOptions>) {

        const config: IWidgetConfiguration = {
            isConfigurable: false,
            isRemovable: true,
            minWidth: 2,
            minHeight: 2,
            maxWidth: 5,
            maxHeight: 5,
            isTimeDependant: true,
            maxInstanceCount: 2,
        };

        super(config, clientId, options);

        this.dataSource = new DataSource();
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
                this.hideSpinner();

                this.counterElement.innerText = data.toString();
            });
    }
    protected handleResize() {
        console.log('Count');
    }
    protected reDraw() {
        this.showSpinner();

        this.dataSource.getData()
            .then(data => {
                this.hideSpinner();

                this.counterElement.innerText = data.toString();
            });
    }

    protected handleClientChange(clientId: number) { }

    private createTitleElement(element: HTMLElement) {
        const p = document.createElement('div');
        p.className = 'title';
        p.innerText = WorkCountByActivityAndStatusWidget.sidebarSettings.title;
        element.appendChild(p);
    }

    private createCounterElement(element: HTMLElement) {
        const el = document.createElement('div');
        el.className = 'counter';
        el.innerHTML = '&nbsp;';
        element.appendChild(el);

        return el;
    }
}

interface IWorkCountByActivityAndStatusWidgetOptions {
    activityTypeId: number;
    workStatusId: number;
}