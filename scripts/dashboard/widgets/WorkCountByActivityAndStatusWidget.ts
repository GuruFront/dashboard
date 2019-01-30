/// <reference path="../Widget.ts" />
class WorkCountByActivityAndStatusWidget extends Widget<IWorkCountByActivityAndStatusWidgetConfiguration> {
    public static readonly id = "workCountByActivityAndStatusWidget";

    private counterElement: HTMLElement;  

    private dataSource: DataSource;

    constructor(options: IWorkCountByActivityAndStatusWidgetConfiguration, clientId: number) {

        const config: IWorkCountByActivityAndStatusWidgetConfiguration = {
            ...options,
            isConfigurable: getValueOrDefault( options.isConfigurable,  false),
            isResizable: getValueOrDefault(options.isResizable, true),
            isRemovable: getValueOrDefault(options.isRemovable, true),
            title: options.title || "Work Counter",
            width: options.width || 2,
            height: options.height || 2,
            minHeight: 1,
            maxHeight: 3,
            minWidth: 1,
            maxWidth: 3,
            isTimeDependant: true
        };

        super(config, clientId); 

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
}

interface IWorkCountByActivityAndStatusWidgetConfiguration extends IWidgetConfiguration {
    activityTypeId: number;
    workStatusId: number;
}