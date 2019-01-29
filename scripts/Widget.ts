/// <reference path="datasources/WorkCompletedDataSource.ts" />
abstract class Widget {
    public readonly id: number;
    public readonly config: IWidgetConfiguration;

    protected cellElement: HTMLElement;
    public isInEditMode: boolean;

    abstract init(element: HTMLElement);

    abstract reInit();

    protected dataSource: DataSource;

    protected constructor(config: IWidgetConfiguration) {
        this.config = config;
        this.id = Math.random();
        this.subscribeToDateChangedEvent();
    }

    public initBase(element: HTMLElement) {
        this.cellElement = element;
        if (this.config.isConfigurable) {
            this.enableEditIcon(element);
        }
        if (this.config.isRemovable) {
            this.enableRemoveIcon(element);
        }
        this.init(element);
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

    protected handleDateChange(newDate: Date, isToday: boolean) {
    }


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

    protected getDataSourceId(): string {
        return null;
    }

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

    private enableRemoveIcon(el): void {
        let icon: HTMLElement = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-delete');
        el.appendChild(icon);
    }

    private enableEditIcon(el): void {
        let icon: HTMLElement = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-edit');
        el.appendChild(icon);
    }

    protected openWidgetSettings(): HTMLElement {
        let
            body: HTMLElement = document.getElementsByTagName('body')[0],
            popupDiv: HTMLElement = document.createElement('div'),
            container: HTMLElement = document.createElement('div');

        popupDiv.setAttribute("class", "grid-item-popup");
        container.setAttribute("class", "grid-item-popup__container");
        popupDiv.appendChild(container);

        body.appendChild(popupDiv);
        return container;
    }

    protected renderForm(settings: IWidgetEditSettings[]) {
        let
            popupContainer: HTMLElement = this.openWidgetSettings(),
            widgetWrap: HTMLElement = document.createElement('div');

        widgetWrap.setAttribute("class", "widget-settings-wrap");
        popupContainer.appendChild(widgetWrap);

        let form = document.createElement('form');
        form.setAttribute("action", "console.log(data)");
        form.setAttribute("method", 'POST');
        widgetWrap.appendChild(form);

        // define input type and call render function
        settings.forEach((inputEl) => {
            switch (inputEl.inputType) {
                case 'radio':
                    renderInputCheck(inputEl);
                    break;
                case 'checkbox':
                    renderInputCheck(inputEl);
                    break;
                case 'select':
                    renderSelect(inputEl);
                    break;
                case 'inputText':
                    renderInputText(inputEl);
                    break;
                default:
                    console.log('Input type not found');
                    break;
            }
        });

        let formButtonsWrap: HTMLElement = document.createElement('div');
        formButtonsWrap.setAttribute("class", "settings-form-btns");

        let
            btnSave: HTMLElement = document.createElement('button'),
            btnCancel: HTMLElement = document.createElement('button');

        btnSave.setAttribute("type", "submit");
        btnSave.innerText = "Apply";
        btnCancel.setAttribute("type", "button");
        btnCancel.innerText = "Cancel";

        formButtonsWrap.appendChild(btnSave);
        formButtonsWrap.appendChild(btnCancel);
        form.appendChild(formButtonsWrap);

        // Get new widget settings
        form.addEventListener("submit", (e) => {
            let data = Array.from(new FormData(form), e => e.map(encodeURIComponent).join('=')).join('&');
            e.preventDefault();
            this.applyNewSettings(data);
        });

        // Cancel/Remove Popup
        btnCancel.addEventListener("click", (e) => {
            let allSettings = document.getElementsByClassName('grid-item-popup');
            for (let i = 0; allSettings.length > i; i++) {
                allSettings[i].remove();
            }
        });

        // render input radio
        function renderInputCheck(inputEl: IWidgetEditSettings) {
            let
                values: Array<string | number> = inputEl.values,
                type: string = inputEl.inputType,
                name: string = inputEl.name,
                titleHtml: HTMLElement = document.createElement('strong'),
                inputWrap = document.createElement('div');

            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;

            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);

            values.forEach((val: string | number) => {
                let label = document.createElement('label'),
                    input = document.createElement('input'),
                    inputText = document.createElement('span');

                label.setAttribute("class", "settings-label");

                inputText.setAttribute("class", "settings-input-text");
                inputText.innerText = val;

                input.setAttribute('name', name);
                input.setAttribute('type', type);
                input.setAttribute('value', val);

                label.appendChild(input);
                label.appendChild(inputText);
                inputWrap.appendChild(label);
            });


        }

        // render select
        function renderSelect(inputEl: IWidgetEditSettings) {
            let
                values: Array<string | number> = inputEl.values,
                name: string = inputEl.name,
                titleHtml: HTMLElement = document.createElement('strong'),
                inputWrap = document.createElement('div');

            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;

            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);

            let select = document.createElement('select');
            select.setAttribute("name", name);
            inputWrap.appendChild(select);

            values.forEach((val: string | number) => {
                let option = document.createElement("option");
                option.setAttribute('value', val);
                option.innerText = val;
                select.appendChild(option);
            });
        }

        // render input text
        function renderInputText(inputEl: IWidgetEditSettings) {
            let
                name: string = inputEl.name,
                placeholder: string = inputEl.placeholder,
                titleHtml: HTMLElement = document.createElement('strong'),
                inputWrap = document.createElement('div');

            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;

            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);

            let input = document.createElement("input");
            input.setAttribute("name", name);
            if (typeof placeholder !== "undefined") {
                input.setAttribute("placeholder", placeholder);
            }
            inputWrap.appendChild(input);
        }


    }

    protected applyNewSettings(result: object) {

    }


}
